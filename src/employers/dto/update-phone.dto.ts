import { IsNumberString, Length, Matches } from 'class-validator';

export class UpdatePhoneDto {
  @IsNumberString({}, { message: 'Phone number must contain only digits' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^\d{10}$/, { message: 'Phone number must be a valid 10-digit number' })
  readonly phone: string;
}

