import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const existingUsers = await this.prisma.user.count();
    if (existingUsers > 0) {
      console.log('Les données de test existent déjà, seed ignoré');
      return;
    }

    console.log('Initialisation des données de test (Togo)...');

    const user1 = await this.prisma.user.create({
      data: {
        firstName: 'Koffi',
        lastName: 'Mensah',
        email: 'koffi.mensah@example.tg',
        tel: '+22890123456',
        avatar: 'uploads/profiles/user1.png',
      },
    });

    const user2 = await this.prisma.user.create({
      data: {
        firstName: 'Ama',
        lastName: 'Aziawor',
        email: 'ama.aziawor@example.tg',
        tel: '+22891234567',
        avatar: 'uploads/profiles/user2.png',
      },
    });

    const property1 = await this.prisma.property.create({
      data: {
        name: 'Villa Moderne à Lomé II',
        description: 'Magnifique villa moderne située dans le quartier résidentiel de Lomé II. Entièrement équipée avec piscine et sécurité 24h/24.',
        image: 'uploads/properties/apartment1.png',
        price: '75000',
        rating: 4.8,
        location: 'Lomé, Togo',
        category: 'Villa',
        lat: 6.1725,
        lng: 1.2314,
        bedrooms: 3,
        bathrooms: 2,
        garage: true,
        parking: 2,
        wifi: true,
        kitchen: 'Moderne et équipée',
        ownerId: user1.id,
      },
    });

    await this.prisma.galleryImage.createMany({
      data: [
        { url: 'uploads/properties/apartment1.png', propertyId: property1.id },
      ],
    });

    const property2 = await this.prisma.property.create({
      data: {
        name: 'Bungalow de Charme à Kpalimé',
        description: 'Charmant bungalow niché au cœur de la verdure de Kpalimé, idéal pour les amoureux de la nature et du calme.',
        image: 'uploads/properties/villa1.png',
        price: '45000',
        rating: 4.9,
        location: 'Kpalimé, Togo',
        category: 'Bungalow',
        lat: 6.9000,
        lng: 0.6333,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        parking: 1,
        wifi: true,
        kitchen: 'Cuisine traditionnelle équipée',
        ownerId: user1.id,
      },
    });

    await this.prisma.galleryImage.createMany({
      data: [
        { url: 'uploads/properties/villa1.png', propertyId: property2.id },
      ],
    });

    const property3 = await this.prisma.property.create({
      data: {
        name: 'Appartement de Luxe à Kara',
        description: 'Appartement spacieux et sécurisé au centre de Kara, parfait pour vos séjours professionnels ou familiaux dans le nord.',
        image: 'uploads/properties/loft1.png',
        price: '35000',
        rating: 4.6,
        location: 'Kara, Togo',
        category: 'Appartement',
        lat: 9.5500,
        lng: 1.1833,
        bedrooms: 2,
        bathrooms: 1,
        garage: false,
        parking: 1,
        wifi: true,
        kitchen: 'Ouverte et moderne',
        ownerId: user2.id,
      },
    });

    await this.prisma.galleryImage.createMany({
      data: [
        { url: 'uploads/properties/loft1.png', propertyId: property3.id },
      ],
    });

    console.log('✅ Données de test togolaises initialisées avec succès!');
    console.log(`  - ${2} utilisateurs créés`);
    console.log(`  - ${3} propriétés créées`);
  }
}
