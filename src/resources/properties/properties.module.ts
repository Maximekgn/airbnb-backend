import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PrismaService } from 'prisma/prisma.service';
import { UrlGeneratorService } from 'src/common/utils/url-generator.service';
import { FileService } from 'src/common/utils/files.service';
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
