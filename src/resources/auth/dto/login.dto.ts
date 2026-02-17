import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email est requis' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'password doit contenir au moins 6 caractères' })
  @IsNotEmpty({ message: 'password est requis' })
  password: string;
}
