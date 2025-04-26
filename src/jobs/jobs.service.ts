import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument, JobStatus } from './schemas/job.schema';
import { Worker, WorkerDocument } from '../workers/schemas/worker.schema';
import { Employer, EmployerDocument } from '../employers/schemas/employer.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { AwardJobDto } from './dto/award-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>
  ) {}

  async createJob(employerId: string, createJobDto: CreateJobDto): Promise<JobDocument> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    // Verify employer exists
    const employer = await this.employerModel.findById(employerId).exec();
    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    // Create new job
    const newJob = new this.jobModel({
      ...createJobDto,
      employerId: new Types.ObjectId(employerId),
      status: JobStatus.OPEN,
      workersApplied: [],
      workerAwarded: null
    });

    const savedJob = await newJob.save();

    // Add job to employer's jobs list
    await this.employerModel.findByIdAndUpdate(
      employerId,
      { $addToSet: { jobs: savedJob._id } },
      { new: true }
    ).exec();

    return savedJob;
  }

  async getJobs(filters: any = {}): Promise<JobDocument[]> {
    const query: any = {};
    
    // Set status filter
    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = JobStatus.OPEN; // Default to open jobs
    }

    // Filter by skills
    if (filters.skills && Array.isArray(filters.skills) && filters.skills.length > 0) {
      query.skillsNeeded = { $in: filters.skills };
    }

    // Filter by pay range
    if (filters.minPay !== undefined) {
      query.pay = { ...query.pay, $gte: Number(filters.minPay) };
    }
    if (filters.maxPay !== undefined) {
      query.pay = { ...query.pay, $lte: Number(filters.maxPay) };
    }

    // Filter by date range
    if (filters.startDate) {
      query.date = { ...query.date, $gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      query.date = { ...query.date, $lte: new Date(filters.endDate) };
    }

    // Filter by location (nearby jobs)
    if (filters.longitude && filters.latitude && filters.maxDistance) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(filters.longitude), Number(filters.latitude)]
          },
          $maxDistance: Number(filters.maxDistance) * 1000 // Convert km to meters
        }
      };
    }

    // Pagination
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const skip = (page - 1) * limit;

    return this.jobModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getJobById(jobId: string): Promise<JobDocument> {
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    const job = await this.jobModel.findById(jobId)
      .populate('employerId', 'username email ratings photoUrl')
      .exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    return job;
  }

  async updateJob(jobId: string, employerId: string, updateJobDto: UpdateJobDto): Promise<JobDocument> {
    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid job ID or employer ID');
    }

    // Verify job belongs to the employer
    const job = await this.jobModel.findOne({
      _id: new Types.ObjectId(jobId),
      employerId: new Types.ObjectId(employerId)
    }).exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found or doesn't belong to employer ${employerId}`);
    }

    // Update job
    const updatedJob = await this.jobModel.findByIdAndUpdate(
      jobId,
      { $set: updateJobDto },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${jobId} not found after update`);
    }

    return updatedJob;
  }

  async applyToJob(jobId: string, workerId: string, applyJobDto: ApplyJobDto): Promise<JobDocument> {
    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(workerId)) {
      throw new BadRequestException('Invalid job ID or worker ID');
    }

    // Verify worker exists
    const worker = await this.workerModel.findById(workerId).exec();
    if (!worker) {
      throw new NotFoundException(`Worker with ID ${workerId} not found`);
    }

    // Verify job exists and is open
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException(`Job with ID ${jobId} is not open for applications`);
    }

    // Check if worker already applied
    if (job.workersApplied.some(applicant => applicant.toString() === workerId)) {
      throw new BadRequestException(`Worker with ID ${workerId} already applied to this job`);
    }

    // Add worker to job's workersApplied array
    const updatedJob = await this.jobModel.findByIdAndUpdate(
      jobId,
      { $addToSet: { workersApplied: new Types.ObjectId(workerId) } },
      { new: true }
    ).exec();

    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${jobId} not found after applying`);
    }

    return updatedJob;
  }

  async awardJob(jobId: string, employerId: string, awardJobDto: AwardJobDto): Promise<JobDocument> {
    const { workerId } = awardJobDto;

    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(employerId) || !Types.ObjectId.isValid(workerId)) {
      throw new BadRequestException('Invalid job ID, employer ID, or worker ID');
    }

    // Verify job belongs to the employer
    const job = await this.jobModel.findOne({
      _id: new Types.ObjectId(jobId),
      employerId: new Types.ObjectId(employerId)
    }).exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found or doesn't belong to employer ${employerId}`);
    }

    // Check if job is already awarded
    if (job.workerAwarded) {
      throw new BadRequestException(`Job with ID ${jobId} is already awarded`);
    }

    // Verify worker exists and has applied to the job
    const worker = await this.workerModel.findById(workerId).exec();
    if (!worker) {
      throw new NotFoundException(`Worker with ID ${workerId} not found`);
    }

    if (!job.workersApplied.some(applicant => applicant.toString() === workerId)) {
      throw new BadRequestException(`Worker with ID ${workerId} has not applied to this job`);
    }

    // Award job to worker and close the job
    const updatedJob = await this.jobModel.findByIdAndUpdate(
      jobId,
      { 
        $set: { 
          workerAwarded: new Types.ObjectId(workerId),
          status: JobStatus.CLOSED
        } 
      },
      { new: true }
    ).exec();

    // Add job to worker's previousWorks array
    await this.workerModel.findByIdAndUpdate(
      workerId,
      { $addToSet: { previousWorks: new Types.ObjectId(jobId) } },
      { new: true }
    ).exec();

    // Add worker to employer's workers array
    await this.employerModel.findByIdAndUpdate(
      employerId,
      { $addToSet: { workers: new Types.ObjectId(workerId) } },
      { new: true }
    ).exec();

    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${jobId} not found after awarding`);
    }

    return updatedJob;
  }

  // Helper method to verify if job exists
  async verifyJobExists(jobId: string): Promise<JobDocument> {
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    return job;
  }

  // Helper method to verify job ownership
  async verifyJobOwnership(jobId: string, employerId: string): Promise<JobDocument> {
    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid job ID or employer ID');
    }

    const job = await this.jobModel.findOne({
      _id: new Types.ObjectId(jobId),
      employerId: new Types.ObjectId(employerId)
    }).exec();

    if (!job) {
      throw new ForbiddenException(`Job with ID ${jobId} doesn't belong to employer ${employerId}`);
    }

    return job;
  }

  // Get worker proposals for a specific job
  async getJobProposals(jobId: string): Promise<WorkerDocument[]> {
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    // Verify job exists
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (!job.workersApplied || job.workersApplied.length === 0) {
      return [];
    }

    // Get worker documents for all applicants
    const workerIds = job.workersApplied.map(id => id.toString());
    const workers = await this.workerModel.find({
      _id: { $in: workerIds }
    })
    .select('username email ratings expertise photoUrl')
    .exec();

    return workers;
  }

  // Get all open jobs
  async getOpenJobs(filters: any = {}): Promise<JobDocument[]> {
    return this.getJobs({
      ...filters,
      status: JobStatus.OPEN
    });
  }
}
