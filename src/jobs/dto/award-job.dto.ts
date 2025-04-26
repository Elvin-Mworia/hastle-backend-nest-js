import { IsString, IsNotEmpty } from 'class-validator';

export class AwardJobDto {
  @IsString()
  @IsNotEmpty()
  workerId: string;
}

