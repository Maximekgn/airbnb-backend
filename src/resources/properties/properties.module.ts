import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UrlGeneratorService } from 'src/services/url-generator.service';
import { FileService } from 'src/services/files.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    PrismaService,
    UrlGeneratorService,
    FileService,
  ],
})
export class PropertiesModule {}
