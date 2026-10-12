import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '../../common/enums/property-type.enum';
import { PricePeriod } from '../../common/enums/price-period.enum';

export class PropertyListItemDto {
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
  @ApiProperty({ nullable: true }) coverImageUrl: string | null;
}