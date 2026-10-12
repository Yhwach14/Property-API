import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { PropertyType } from '../../common/enums/property-type.enum';
import { PricePeriod } from '../../common/enums/price-period.enum';

export class CreatePropertyDto {
  @IsString()
  @Length(3, 120)
  title: string;

  @IsString()
  @Length(1, 5000)
  description: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsEnum(PricePeriod)
  pricePeriod: PricePeriod;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'currency must be a 3-letter uppercase code' })
  currency?: string = 'USD';

  @IsString()
  @Length(1, 100)
  city: string;

  @IsString()
  @Length(1, 255)
  address: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsInt()
  @Min(0)
  @Max(50)
  bedrooms: number;

  @IsInt()
  @Min(0)
  @Max(50)
  bathrooms: number;

  @IsInt()
  @Min(1)
  @Max(100)
  maxGuests: number;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  contactPhone?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds?: string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;
}