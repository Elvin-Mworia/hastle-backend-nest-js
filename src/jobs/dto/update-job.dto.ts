import { Type } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsNumber, 
  Min, 
  IsDate, 
  IsOptional,
  IsEnum,
  ArrayMinSize,
  ValidateNested 
} from 'class-validator';
import { LocationDto } from './job-location.dto';
import { JobStatus } from '../schemas/job.schema';

export class UpdateJobDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  skillsNeeded?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  pay?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  duration?: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}

