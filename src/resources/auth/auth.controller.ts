import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService, LoginResponse, SafeUser } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { multerOptions } from '../../config/multer.config';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const payload: RegisterDto = {
      ...registerDto,
      ...(file && { avatar: file.filename || file.originalname }),
    };

    try {
      return await this.authService.register(payload);
    } catch (error) {
      // Si l'enregistrement échoue, supprimer le fichier uploadé
      if (file) {
        try {
          const filePath = join(file.destination, file.filename);
          unlinkSync(filePath);
        } catch (deleteError) {
          console.error('Erreur lors de la suppression du fichier:', deleteError);
        }
      }
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const user: SafeUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
