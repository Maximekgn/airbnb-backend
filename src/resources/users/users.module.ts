import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UrlGeneratorService } from 'src/services/url-generator.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UrlGeneratorService],
  exports: [UsersService],
})
export class UsersModule {}
