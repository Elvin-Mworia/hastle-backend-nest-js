import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsPhoneNumber, IsString, IsUrl, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class WorkerProfileDto {
  @Expose()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  phone: number;

  @Expose()
  @IsNumber()
  @Min(0, { message: 'Rating cannot be less than 0' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  ratings: number;

  @Expose()
  @IsArray()
  @Transform(({ value }) => value ? value.map(id => id.toString()) : [])
  previousWorks: string[];

  @Expose()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format for photo' })
  photoUrl: string;
}

