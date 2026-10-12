import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '../../common/enums/property-type.enum';
import { PricePeriod } from '../../common/enums/price-period.enum';

class AmenityDto {
  @ApiProperty() id: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
}

class ImageDto {
  @ApiProperty() id: string;
  @ApiProperty() url: string;
  @ApiProperty() sortOrder: number;
  @ApiProperty() isCover: boolean;
}

class OwnerSummaryDto {
  @ApiProperty() id: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
}

export class PropertyDetailDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty({ enum: PropertyType }) type: PropertyType;
  @ApiProperty() price: number;
  @ApiProperty() currency: string;
  @ApiProperty({ enum: PricePeriod }) pricePeriod: PricePeriod;
  @ApiProperty() city: string;
  @ApiProperty() bedrooms: number;
  @ApiProperty() bathrooms: number;
  @ApiProperty() maxGuests: number;
  @ApiProperty() description: string;
  @ApiProperty() address: string;
  @ApiProperty({ nullable: true }) latitude: number | null;
  @ApiProperty({ nullable: true }) longitude: number | null;
  @ApiProperty({ type: [AmenityDto] }) amenities: AmenityDto[];
  @ApiProperty({ type: [ImageDto] }) images: ImageDto[];
  @ApiProperty() contactEmail: string;
  @ApiProperty({ type: OwnerSummaryDto }) owner: OwnerSummaryDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ nullable: true }) contactPhone: string | null;
}