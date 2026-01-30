import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/properties',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    return await this.propertiesService.create(createPropertyDto, files);
  }

  @Get()
  async findAll() {
    return await this.propertiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/properties',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    return await this.propertiesService.update(id, updatePropertyDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.propertiesService.remove(id);
  }
}
