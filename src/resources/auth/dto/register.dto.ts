import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'firstName est requis' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'lastName est requis' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email est requis' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'password doit contenir au moins 6 caractères' })
  @IsNotEmpty({ message: 'password est requis' })
  password: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  tel?: string;
}
