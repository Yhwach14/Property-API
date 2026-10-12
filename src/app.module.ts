import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { AmenitiesModule } from './amenities/amenities.module.js';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    AmenitiesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    UsersModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
