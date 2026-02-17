import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { PropertiesModule } from './resources/properties/properties.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './resources/auth/auth.module';
import { CategoriesModule } from './resources/categories/categories.module';
import { PrismaService } from '../prisma/prisma.service';
import { SeedModule } from './resources/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    PropertiesModule,
    AuthModule,
    CategoriesModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
