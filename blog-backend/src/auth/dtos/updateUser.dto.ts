import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly username?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;

  @IsOptional()
  @IsStrongPassword()
  @IsNotEmpty()
  readonly password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Profile image must be a valid URL' })
    profile_image?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Cover image must be a valid URL' })
   cover_image?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Personal link must be a valid URL' })
  readonly personal_link?: string;
}
