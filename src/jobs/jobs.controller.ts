import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  Query, 
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { AwardJobDto } from './dto/award-job.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { WorkerProposalDto } from './dto/worker-proposal.dto';
import { plainToClass } from 'class-transformer';

@Controller('jobs')
@UseInterceptors(ClassSerializerInterceptor)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // POST /jobs - Create a new job
  @Post()
  async createJob(@Body() createJobDto: CreateJobDto): Promise<JobResponseDto> {
    try {
      // TODO: Replace with actual authenticated employer ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const job = await this.jobsService.createJob(employerId, createJobDto);
      return plainToClass(JobResponseDto, job, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create job',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /jobs - Get all jobs with filters
  @Get()
  async getJobs(
    @Query('skills') skills: string,
    @Query('minPay') minPay: number,
    @Query('maxPay') maxPay: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('maxDistance') maxDistance: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<JobResponseDto[]> {
    try {
      // Parse skills array from comma-separated string if provided
      const parsedSkills = skills ? skills.split(',') : [];
      
      const filters = {
        skills: parsedSkills,
        minPay,
        maxPay,
        startDate,
        endDate,
        longitude,
        latitude,
        maxDistance,
        page,
        limit
      };

      const jobs = await this.jobsService.getJobs(filters);
      return jobs.map(job => plainToClass(JobResponseDto, job, { excludeExtraneousValues: true }));
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve jobs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /jobs/:id - Get a specific job
  @Get(':id')
  async getJobById(@Param('id') id: string): Promise<JobResponseDto> {
    try {
      const job = await this.jobsService.getJobById(id);
      return plainToClass(JobResponseDto, job, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve job',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // PATCH /jobs/:id - Update a job
  @Patch(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto
  ): Promise<JobResponseDto> {
    try {
      // TODO: Replace with actual authenticated employer ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const job = await this.jobsService.updateJob(id, employerId, updateJobDto);
      return plainToClass(JobResponseDto, job, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException ||
          error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update job',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // POST /jobs/:id/apply - Apply to a job
  @Post(':id/apply')
  async applyToJob(
    @Param('id') id: string,
    @Body() applyJobDto: ApplyJobDto
  ): Promise<JobResponseDto> {
    try {
      // TODO: Replace with actual authenticated worker ID
      const workerId = '60d0fe4f5311236168a109cb'; // Dummy ID for demonstration
      const job = await this.jobsService.applyToJob(id, workerId, applyJobDto);
      return plainToClass(JobResponseDto, job, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to apply to job',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // POST /jobs/:id/award - Award a job to a worker
  @Post(':id/award')
  async awardJob(
    @Param('id') id: string,
    @Body() awardJobDto: AwardJobDto
  ): Promise<JobResponseDto> {
    try {
      // TODO: Replace with actual authenticated employer ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const job = await this.jobsService.awardJob(id, employerId, awardJobDto);
      return plainToClass(JobResponseDto, job, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException ||
          error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        'Failed to award job',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // GET /jobs/status/open - Get all open jobs
  @Get('status/open')
  async getOpenJobs(
    @Query('skills') skills: string,
    @Query('minPay') minPay: number,
    @Query('maxPay') maxPay: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('maxDistance') maxDistance: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<JobResponseDto[]> {
    try {
      // Parse skills array from comma-separated string if provided
      const parsedSkills = skills ? skills.split(',') : [];
      
      const filters = {
        skills: parsedSkills,
        minPay,
        maxPay,
        startDate,
        endDate,
        longitude,
        latitude,
        maxDistance,
        page,
        limit
      };

      const jobs = await this.jobsService.getOpenJobs(filters);
      return jobs.map(job => plainToClass(JobResponseDto, job, { excludeExtraneousValues: true }));
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve open jobs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /jobs/:id/proposals - Get worker proposals for a specific job
  @Get(':id/proposals')
  async getJobProposals(@Param('id') id: string): Promise<WorkerProposalDto[]> {
    try {
      const workers = await this.jobsService.getJobProposals(id);
      return workers.map(worker => {
        const workerObj = worker.toObject();
        return plainToClass(WorkerProposalDto, {
          id: workerObj._id,
          username: workerObj.username,
          email: workerObj.email,
          ratings: workerObj.ratings,
          expertise: workerObj.expertise,
          photoUrl: workerObj.photoUrl,
          appliedAt: new Date()  // This should ideally come from application timestamp
        }, { excludeExtraneousValues: true });
      });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve job proposals',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
