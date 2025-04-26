import { Type } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsNumber, 
  Min, 
  IsDate, 
  ArrayMinSize,
  ValidateNested 
} from 'class-validator';
import { LocationDto } from './job-location.dto';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  skillsNeeded: string[];

  @IsNumber()
  @Min(0)
  pay: number;

  @IsString()
  @IsNotEmpty()
  duration: string;
}

