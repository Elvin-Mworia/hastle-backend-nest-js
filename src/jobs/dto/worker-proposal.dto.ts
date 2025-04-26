import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString, IsUrl, Max, Min } from 'class-validator';

export class WorkerProposalDto {
  @Expose()
  @Transform(({ value }) => value?.toString() || '')
  id: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratings: number;

  @Expose()
  @IsArray()
  expertise: string[];

  @Expose()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format for photo' })
  photoUrl: string;

  @Expose()
  @Transform(({ value }) => value?.toString() || '')
  appliedAt: Date;
}

