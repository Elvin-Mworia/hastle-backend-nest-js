import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString, IsUrl, Max, Min } from 'class-validator';

export class JobProposalDto {
  @Expose()
  @IsString()
  @Transform(({ value }) => value?.toString() || '')
  workerId: string;

  @Expose()
  @IsString()
  workerName: string;

  @Expose()
  @IsNumber()
  @Min(0, { message: 'Rating cannot be less than 0' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  ratings: number;

  @Expose()
  @IsArray()
  expertise: string[];

  @Expose()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format for photo' })
  photoUrl: string;
}
