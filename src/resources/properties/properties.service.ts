import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/services/prisma.service';
import { FileService } from 'src/services/files.service';
import { UrlGeneratorService } from 'src/services/url-generator.service';

@Injectable()
export class PropertiesService {
  constructor(
    private prisma: PrismaService,
    private urlGenerator: UrlGeneratorService,
    private fileService: FileService,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    files: { image?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    userId: string,
  ) {
    const mainImageUrl =
      files.image?.[0]?.path.replace(/\\/g, '/') ||
      createPropertyDto.image ||
      '';
    const galleryUrls =
      files.gallery?.map((file) => file.path.replace(/\\/g, '/')) || [];

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
      if (files.image?.[0]) this.fileService.deleteFile(files.image[0].path);
      if (files.gallery)
        files.gallery.forEach((file) => this.fileService.deleteFile(file.path));
      throw error;
    }
  }

  async findAll() {
    const properties = await this.prisma.property.findMany();

    return properties.map((property) => ({
      ...property,
      image: this.urlGenerator.generateUrl(property.image),
    }));
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
      image: this.urlGenerator.generateUrl(property.image),
      owner: property.owner
        ? {
            ...property.owner,
            avatar: property.owner.avatar
              ? this.urlGenerator.generateUrl(property.owner.avatar)
              : null,
          }
        : null,
      gallery: property.gallery.map((img) => ({
        ...img,
        url: this.urlGenerator.generateUrl(img.url),
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
        this.fileService.deleteFile(oldProperty.image);
      }
      if (files?.gallery && files.gallery.length > 0) {
        oldProperty.gallery.forEach((img) =>
          this.fileService.deleteFile(img.url),
        );
      }

      return updated;
    } catch (error) {
      // SI ÉCHEC : On supprime les NOUVEAUX fichiers uploadés
      if (files?.image?.[0]) this.fileService.deleteFile(files.image[0].path);
      if (files?.gallery)
        files.gallery.forEach((file) => this.fileService.deleteFile(file.path));
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
    this.fileService.deleteFile(property.image);
    property.gallery.forEach((img) => this.fileService.deleteFile(img.url));

    return result;
  }
}
