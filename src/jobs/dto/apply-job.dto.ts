import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  coverLetter?: string;
}

