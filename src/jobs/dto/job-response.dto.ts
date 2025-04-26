import { Expose, Transform, Type } from 'class-transformer';
import { 
  IsArray, 
  IsDate, 
  IsEnum, 
  IsNumber,
  IsString,
  ValidateNested 
} from 'class-validator';
import { JobStatus } from '../schemas/job.schema';
import { LocationDto } from './job-location.dto';

export class JobResponseDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  employerId: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @Expose()
  @IsDate()
  date: Date;

  @Expose()
  @IsArray()
  skillsNeeded: string[];

  @Expose()
  @IsNumber()
  pay: number;

  @Expose()
  @IsString()
  duration: string;

  @Expose()
  @IsArray()
  @Transform(({ value }) => value ? value.map(id => id.toString()) : [])
  workersApplied: string[];

  @Expose()
  @IsEnum(JobStatus)
  status: string;

  @Expose()
  @Transform(({ value }) => value?.toString() || null)
  workerAwarded: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

