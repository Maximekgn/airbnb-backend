import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async seedCategories() {
    this.logger.log('Starting category seeding...');

    const categories = [
      {
        name: 'Apartment',
        description: 'Modern apartments in urban areas',
        icon: '🏢',
      },
      {
        name: 'House',
        description: 'Family houses with gardens',
        icon: '🏠',
      },
      {
        name: 'Villa',
        description: 'Luxury villas with premium amenities',
        icon: '🏰',
      },
      {
        name: 'Studio',
        description: 'Compact studio apartments',
        icon: '🏡',
      },
      {
        name: 'Loft',
        description: 'Industrial loft spaces',
        icon: '🏭',
      },
      {
        name: 'Penthouse',
        description: 'Top-floor luxury apartments',
        icon: '🌟',
      },
      {
        name: 'Cottage',
        description: 'Cozy countryside cottages',
        icon: '🏚️',
      },
      {
        name: 'Mansion',
        description: 'Grand mansions with extensive grounds',
        icon: '🏛️',
      },
      {
        name: 'Townhouse',
        description: 'Multi-story urban townhouses',
        icon: '🏘️',
      },
      {
        name: 'Bungalow',
        description: 'Single-story bungalows',
        icon: '🏚️',
      },
      {
        name: 'Tiny House',
        description: 'Minimalist tiny houses',
        icon: '🏠',
      },
      {
        name: 'Beach House',
        description: 'Beachfront properties',
        icon: '🏖️',
      },
      {
        name: 'Mountain Cabin',
        description: 'Mountain retreat cabins',
        icon: '⛰️',
      },
      {
        name: 'Eco-Lodge',
        description: 'Sustainable eco-friendly accommodations',
        icon: '🌿',
      },
      {
        name: 'Castle',
        description: 'Historic castles and manor houses',
        icon: '🏰',
      },
    ];

    let createdCount = 0;
    let existingCount = 0;

    for (const category of categories) {
      try {
        const existing = await this.prisma.category.findUnique({
          where: { name: category.name },
        });

        if (existing) {
          this.logger.log(
            `Category "${category.name}" already exists, skipping...`,
          );
          existingCount++;
        } else {
          await this.prisma.category.create({
            data: category,
          });
          this.logger.log(`Created category: ${category.name}`);
          createdCount++;
        }
      } catch (error) {
        this.logger.error(
          `Error creating category ${category.name}:`,
          error.message,
        );
      }
    }

    this.logger.log(`Category seeding completed!`);
    this.logger.log(`Created: ${createdCount} categories`);
    this.logger.log(`Skipped (already exist): ${existingCount} categories`);

    return {
      created: createdCount,
      existing: existingCount,
      total: categories.length,
    };
  }

  async seedAll() {
    this.logger.log('Starting database seeding...');

    const results = {
      categories: await this.seedCategories(),
    };

    this.logger.log('Database seeding completed!');
    return results;
  }
}
