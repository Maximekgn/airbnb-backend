import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { PropertiesModule } from './resources/properties/properties.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './resources/auth/auth.module';
import { PrismaService } from './prisma.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PropertiesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SeedService],
})
export class AppModule {}
