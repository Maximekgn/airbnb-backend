import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly baseUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        properties: true,
      },
    });

    // Ajouter l'URL complète aux chemins d'avatars et exclure les mots de passe
    return users.map((user) => {
      const { password, ...result } = user;
      return {
        ...result,
        avatar: this.formatUrl(user.avatar),
      };
    });
  }

  private formatUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        properties: true,
      },
    });

    if (!user) {
      return null;
    }

    // Ajouter l'URL complète au chemin de l'avatar et exclure le mot de passe
    const { password, ...result } = user;
    return {
      ...result,
      avatar: this.formatUrl(user.avatar),
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password, ...result } = user;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    const { password, ...result } = user;
    return result;
  }
}
