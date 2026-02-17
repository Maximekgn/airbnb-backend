import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from '../services/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    console.log('\n🌱 Starting database seeding...\n');

    const results = await seedService.seedAll();

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('Results:');
    console.log(
      `  Categories: ${results.categories.created} created, ${results.categories.existing} already existed`,
    );
    console.log(`  Total categories: ${results.categories.total}\n`);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
