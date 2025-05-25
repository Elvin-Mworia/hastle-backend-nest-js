/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  // @MinLength(3, { message: 'Username must be at least 3 characters long' })
  readonly firstName: string;

    @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  // @MinLength(3, { message: 'Username must be at least 3 characters long' })
  readonly lastName: string;

  // @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  // @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

    @IsString()
  @IsNotEmpty({ message: 'user category required' })
  // @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly userCategory: string;
}
