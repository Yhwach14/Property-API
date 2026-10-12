import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PropertyType } from '../../common/enums/property-type.enum';
import { PropertySortBy } from '../../common/enums/property-sortby.enum';
import { sortOrder } from '../../common/enums/sort-order.enum';
import { MaxPriceAfterMin } from '../../common/validators/max-price-after-min.validator';

export class ListPropertiesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @MaxPriceAfterMin()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  amenities?: string[];

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(PropertySortBy)
  sortBy: PropertySortBy = PropertySortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(sortOrder)
  sortOrder: sortOrder = sortOrder.DESC;
}