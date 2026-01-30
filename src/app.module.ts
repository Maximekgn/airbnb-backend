import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { PropertiesModule } from './resources/properties/properties.module';

@Module({
  imports: [UsersModule,PropertiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
