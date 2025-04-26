import { 
  Controller, 
  Get, 
  Patch, 
  Body, 
  Param, 
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { EmployersService } from './employers.service';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { EmployerProfileDto } from './dto/employer-profile.dto';
import { JobProposalDto } from './dto/job-proposal.dto';
import { plainToClass } from 'class-transformer';
import { WorkerDocument } from '../workers/schemas/worker.schema';

@Controller('employers')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  // GET /employers/profile
  // TODO: Add authentication guard
  @Get('profile')
  async getEmployerProfile(): Promise<EmployerProfileDto> {
    try {
      // TODO: Replace with actual authenticated user ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const employer = await this.employersService.getEmployerProfile(employerId);
      return plainToClass(EmployerProfileDto, employer, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve employer profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /employers/jobs
  // TODO: Add authentication guard
  @Get('jobs')
  async getEmployerJobs(): Promise<any> {
    try {
      // TODO: Replace with actual authenticated user ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      return await this.employersService.getEmployerJobs(employerId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve employer jobs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /employers/workers
  // TODO: Add authentication guard
  @Get('workers')
  async getEmployedWorkers(): Promise<any> {
    try {
      // TODO: Replace with actual authenticated user ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      return await this.employersService.getEmployedWorkers(employerId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve employed workers',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /employers/jobs/:jobId/proposals
  // TODO: Add authentication guard
  @Get('jobs/:jobId/proposals')
  async getJobProposals(@Param('jobId') jobId: string): Promise<JobProposalDto[]> {
    try {
      // TODO: Replace with actual authenticated user ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const workers = await this.employersService.getJobProposals(employerId, jobId);
      
      return workers.map(worker => {
        const workerObj = worker.toObject();
        return plainToClass(JobProposalDto, {
          workerId: workerObj._id,
          workerName: workerObj.username,
          ratings: workerObj.ratings,
          expertise: workerObj.expertise,
          photoUrl: workerObj.photoUrl
        }, { excludeExtraneousValues: true });
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve job proposals',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // PATCH /employers/phone
  // TODO: Add authentication guard
  @Patch('phone')
  async updatePhoneNumber(@Body() updatePhoneDto: UpdatePhoneDto): Promise<any> {
    try {
      // TODO: Replace with actual authenticated user ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      return await this.employersService.updatePhoneNumber(employerId, updatePhoneDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update phone number',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // PATCH /employers/photo
  // TODO: Add authentication guard
  @Patch('photo')
  async updatePhotoUrl(@Body() updatePhotoDto: UpdatePhotoDto): Promise<any> {
    try {
      // TODO: Replace with actual authenticated user ID
      const employerId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      return await this.employersService.updatePhotoUrl(employerId, updatePhotoDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update photo URL',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

