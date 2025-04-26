import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class EmployerProfileDto {
  @Expose()
  @IsNumber()
  @Min(0, { message: 'Rating cannot be less than 0' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  ratings: number;

  @Expose()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => id.toString());
    }
    return [];
  })
  jobs: string[];

  @Expose()
  @IsNumber()
  @Min(0, { message: 'Credit cannot be less than 0' })
  credit: number;

  @Expose()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(id => id.toString());
    }
    return [];
  })
  workers: string[];

  @Expose()
  @IsString()
  photoUrl: string;

  @Expose()
  @IsNumber()
  phone: number;

  @Expose()
  @Transform(({ obj }) => obj.workers?.length || 0)
  workersCount: number;
}
