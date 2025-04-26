import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Employer, EmployerDocument } from './schemas/employer.schema';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import { Worker, WorkerDocument } from '../workers/schemas/worker.schema';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>
  ) {}

  async getEmployerProfile(employerId: string): Promise<Employer> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    const employer = await this.employerModel.findById(employerId)
      .select('ratings jobs credit workers photoUrl phone')
      .exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }
    
    return employer;
  }

  async getEmployerJobs(employerId: string): Promise<JobDocument[]> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    // Check if employer exists
    const employer = await this.employerModel.findById(employerId).exec();
    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    // Find all jobs posted by this employer
    const jobs = await this.jobModel.find({ employerId: new Types.ObjectId(employerId) }).exec();
    return jobs;
  }

  async getEmployedWorkers(employerId: string): Promise<WorkerDocument[]> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    const employer = await this.employerModel.findById(employerId)
      .populate('workers')
      .exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    return employer.workers as unknown as WorkerDocument[];
  }

  async getJobProposals(employerId: string, jobId: string): Promise<WorkerDocument[]> {
    if (!Types.ObjectId.isValid(employerId) || !Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid employer ID or job ID');
    }

    // Verify the job belongs to this employer
    const job = await this.jobModel.findOne({
      _id: new Types.ObjectId(jobId),
      employerId: new Types.ObjectId(employerId)
    }).exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found or does not belong to this employer`);
    }

    // Get workers who applied to this job
    const workersApplied = job.get('workersApplied');
    if (!workersApplied || !Array.isArray(workersApplied) || workersApplied.length === 0) {
      return [];
    }

    // Convert to string IDs for querying
    const workerIdStrings = workersApplied.map(id => id.toString());

    // Fetch worker details
    const workers = await this.workerModel.find({
      _id: { $in: workerIdStrings }
    }).select('username email ratings expertise photoUrl').exec();

    return workers;
  }

  async updatePhoneNumber(employerId: string, updatePhoneDto: UpdatePhoneDto): Promise<Employer> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    const employer = await this.employerModel.findByIdAndUpdate(
      employerId,
      { phone: Number(updatePhoneDto.phone) },
      { new: true, runValidators: true }
    ).exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    return employer;
  }

  async updatePhotoUrl(employerId: string, updatePhotoDto: UpdatePhotoDto): Promise<Employer> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    const employer = await this.employerModel.findByIdAndUpdate(
      employerId,
      { photoUrl: updatePhotoDto.photoUrl },
      { new: true, runValidators: true }
    ).exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    return employer;
  }

  // Helper method to add a worker to the employer's workers array
  async addWorker(employerId: string, workerId: string): Promise<Employer> {
    if (!Types.ObjectId.isValid(employerId) || !Types.ObjectId.isValid(workerId)) {
      throw new BadRequestException('Invalid employer ID or worker ID');
    }

    const employer = await this.employerModel.findByIdAndUpdate(
      employerId,
      { $addToSet: { workers: workerId } },
      { new: true, runValidators: true }
    ).exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    return employer;
  }

  // Helper method to add a job to the employer's jobs array
  async addJob(employerId: string, jobId: string): Promise<Employer> {
    if (!Types.ObjectId.isValid(employerId) || !Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid employer ID or job ID');
    }

    const employer = await this.employerModel.findByIdAndUpdate(
      employerId,
      { $addToSet: { jobs: jobId } },
      { new: true, runValidators: true }
    ).exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    return employer;
  }

  // Helper method to update employer's credit
  async updateCredit(employerId: string, amount: number): Promise<Employer> {
    if (!Types.ObjectId.isValid(employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    const employer = await this.employerModel.findByIdAndUpdate(
      employerId,
      { $inc: { credit: amount } },
      { new: true, runValidators: true }
    ).exec();

    if (!employer) {
      throw new NotFoundException(`Employer with ID ${employerId} not found`);
    }

    return employer;
  }
}

