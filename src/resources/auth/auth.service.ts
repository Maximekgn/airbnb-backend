import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  tel: string | null;
}

interface UserPayload {
  email: string;
  sub: string;
}

export interface LoginResponse {
  access_token: string;
  user: { email: string; id: string };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingMail = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingMail) {
      throw new BadRequestException('Email already in use');
    }

    if (createUserDto.tel) {
      const existingPhone = await this.usersService.findByPhone(
        createUserDto.tel,
      );
      if (existingPhone) {
        throw new BadRequestException('tel already in use');
      }
    }

    return this.usersService.create(createUserDto);
  }

  async validateUser(email: string, pass: string): Promise<SafeUser> {
    if (!email || !pass) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  async login(user: { email: string; id: string }): Promise<LoginResponse> {
    if (!user?.email || !user?.id) {
      throw new BadRequestException('User email and id are required');
    }

    const payload: UserPayload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: { email: user.email, id: user.id },
    };
  }
}
