import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from './schemas/worker.schema';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>
  ) {}

  async getWorkerProfile(userId: string): Promise<Worker> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const worker = await this.workerModel.findById(userId).exec();
    if (!worker) {
      throw new NotFoundException(`Worker with ID ${userId} not found`);
    }
    
    return worker;
  }

  async updatePhoneNumber(userId: string, updatePhoneDto: UpdatePhoneDto): Promise<Worker> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const worker = await this.workerModel.findByIdAndUpdate(
      userId,
      { phone: Number(updatePhoneDto.phone) },
      { new: true, runValidators: true }
    ).exec();

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${userId} not found`);
    }

    return worker;
  }

  async updatePhotoUrl(userId: string, updatePhotoDto: UpdatePhotoDto): Promise<Worker> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const worker = await this.workerModel.findByIdAndUpdate(
      userId,
      { photoUrl: updatePhotoDto.photoUrl },
      { new: true, runValidators: true }
    ).exec();

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${userId} not found`);
    }

    return worker;
  }

  async getWorkerById(workerId: string): Promise<Worker> {
    if (!Types.ObjectId.isValid(workerId)) {
      throw new BadRequestException('Invalid worker ID');
    }

    const worker = await this.workerModel.findById(workerId)
      .select('phone ratings previousWorks photoUrl')
      .populate('previousWorks')
      .exec();

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${workerId} not found`);
    }

    return worker;
  }

  // Additional method to update expertise
  async updateExpertise(userId: string, expertise: string[]): Promise<Worker> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const worker = await this.workerModel.findByIdAndUpdate(
      userId,
      { expertise },
      { new: true, runValidators: true }
    ).exec();

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${userId} not found`);
    }

    return worker;
  }

  // Method to add job to previousWorks
  async addToPreviousWorks(workerId: string, jobId: string): Promise<Worker> {
    if (!Types.ObjectId.isValid(workerId) || !Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid worker ID or job ID');
    }

    const worker = await this.workerModel.findByIdAndUpdate(
      workerId,
      { $addToSet: { previousWorks: jobId } },
      { new: true, runValidators: true }
    ).exec();

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${workerId} not found`);
    }

    return worker;
  }
}

