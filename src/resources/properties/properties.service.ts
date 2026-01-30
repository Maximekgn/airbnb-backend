import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class PropertiesService {
  private readonly baseUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
  }

  async create(
    createPropertyDto: CreatePropertyDto,
    files: { image?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    userId: string,
  ) {
    const mainImageUrl = files.image?.[0]?.path.replace(/\\/g, '/') || createPropertyDto.image || '';
    const galleryUrls = files.gallery?.map((file) => file.path.replace(/\\/g, '/')) || [];

    const { image, ownerId, ...propertyData } = createPropertyDto;

    try {
      return await this.prisma.property.create({
        data: {
          ...propertyData,
          image: mainImageUrl,
          ownerId: userId,
          gallery: {
            create: galleryUrls.map((url) => ({ url })),
          },
        },
      });
    } catch (error) {
      // En cas d'échec de la DB, on supprime les fichiers fraîchement uploadés
      if (files.image?.[0]) this.deleteFile(files.image[0].path);
      if (files.gallery) files.gallery.forEach((file) => this.deleteFile(file.path));
      throw error;
    }
  }

  private deleteFile(path: string | null) {
    if (!path || path.startsWith('http')) return;
    const absolutePath = join(process.cwd(), path);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch (err) {
        console.error(`Erreur lors de la suppression du fichier ${absolutePath}:`, err);
      }
    }
  }

  async findAll() {
    const properties = await this.prisma.property.findMany({});

    return properties.map((property) => ({
      ...property,
      image: this.formatUrl(property.image),
    }));
  }

  private formatUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        gallery: true,
      },
    });

    if (!property) {
      return null;
    }

    // Ajouter l'URL complète aux chemins d'images
    return {
      ...property,
      image: this.formatUrl(property.image),
      owner: property.owner ? {
        ...property.owner,
        avatar: this.formatUrl(property.owner.avatar),
      } : null,
      gallery: property.gallery.map((img) => ({
        ...img,
        url: this.formatUrl(img.url),
      })),
    };
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    files?: { image?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
  ) {
    const { image, ...updateData } = updatePropertyDto;
    const data: any = { ...updateData };

    // On récupère l'ancienne propriété pour pouvoir supprimer les anciens fichiers si succès
    const oldProperty = await this.prisma.property.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!oldProperty) return null;

    if (files?.image?.[0]) {
      data.image = files.image[0].path.replace(/\\/g, '/');
    } else if (image) {
      data.image = image;
    }

    if (files?.gallery && files.gallery.length > 0) {
      data.gallery = {
        deleteMany: {},
        create: files.gallery.map((file) => ({
          url: file.path.replace(/\\/g, '/'),
        })),
      };
    }

    try {
      const updated = await this.prisma.property.update({
        where: { id },
        data,
      });

      // SI SUCCÈS : On supprime les ANCIENS fichiers s'ils ont été remplacés
      if (files?.image?.[0] && oldProperty.image) {
        this.deleteFile(oldProperty.image);
      }
      if (files?.gallery && files.gallery.length > 0) {
        oldProperty.gallery.forEach((img) => this.deleteFile(img.url));
      }

      return updated;
    } catch (error) {
      // SI ÉCHEC : On supprime les NOUVEAUX fichiers uploadés
      if (files?.image?.[0]) this.deleteFile(files.image[0].path);
      if (files?.gallery) files.gallery.forEach((file) => this.deleteFile(file.path));
      throw error;
    }
  }

  async remove(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!property) return null;

    const result = await this.prisma.property.delete({
      where: { id },
    });

    // On supprime les fichiers du disque après la suppression en DB
    this.deleteFile(property.image);
    property.gallery.forEach((img) => this.deleteFile(img.url));

    return result;
  }
}
