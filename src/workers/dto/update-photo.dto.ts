import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  @IsNotEmpty({ message: 'Photo URL is required' })
  @IsUrl({}, { message: 'Invalid URL format for photo' })
  readonly photoUrl: string;
}

