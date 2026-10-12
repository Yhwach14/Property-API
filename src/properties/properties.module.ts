import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Amenity } from '../amenities/entities/amenity.entity';
import { MePropertiesController } from './me-properties.controller';
import { StorageModule } from '../storage/storage.module';
import { PropertyImagesController } from './property-images.controller';
import { PropertyImagesService } from './property-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyImage, Amenity]),
    StorageModule,
  ],
  controllers: [
    PropertiesController,
    MePropertiesController,
    PropertyImagesController,
  ],
  providers: [PropertiesService, PropertyImagesService],
})
export class PropertiesModule {}
