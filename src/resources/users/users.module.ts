import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { UrlGeneratorService } from 'src/common/utils/url-generator.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UrlGeneratorService],
  exports: [UsersService],
})
export class UsersModule {}
