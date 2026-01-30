import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        properties: true,
      },
    });

    // Ajouter l'URL complète aux chemins d'avatars
    return users.map((user) => ({
      ...user,
      avatar: this.formatUrl(user.avatar),
    }));
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

    // Ajouter l'URL complète au chemin de l'avatar
    return {
      ...user,
      avatar: this.formatUrl(user.avatar),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
