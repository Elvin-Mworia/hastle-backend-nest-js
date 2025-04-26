import { 
  Controller, 
  Get, 
  Patch, 
  Body, 
  Param, 
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { WorkerProfileDto } from './dto/worker-profile.dto';
import { plainToClass } from 'class-transformer';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  // GET /workers/profile
  // In a real app, this would use authentication to get the current user ID
  // For now, we'll use a dummy ID for demonstration
  @Get('profile')
  async getWorkerProfile() {
    try {
      // TODO: Replace with actual authenticated user ID
      const userId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const worker = await this.workersService.getWorkerProfile(userId);
      return worker;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve worker profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // PATCH /workers/phone
  @Patch('phone')
  async updatePhoneNumber(@Body() updatePhoneDto: UpdatePhoneDto) {
    try {
      // TODO: Replace with actual authenticated user ID
      const userId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const updatedWorker = await this.workersService.updatePhoneNumber(userId, updatePhoneDto);
      return updatedWorker;
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

  // PATCH /workers/photo
  @Patch('photo')
  async updatePhotoUrl(@Body() updatePhotoDto: UpdatePhotoDto) {
    try {
      // TODO: Replace with actual authenticated user ID
      const userId = '60d0fe4f5311236168a109ca'; // Dummy ID for demonstration
      const updatedWorker = await this.workersService.updatePhotoUrl(userId, updatePhotoDto);
      return updatedWorker;
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

  // GET /workers/:id
  @Get(':id')
  async getWorkerById(@Param('id') id: string) {
    try {
      const worker = await this.workersService.getWorkerById(id);
      // Transform to DTO to only return specified fields
      return plainToClass(WorkerProfileDto, worker, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve worker information',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

