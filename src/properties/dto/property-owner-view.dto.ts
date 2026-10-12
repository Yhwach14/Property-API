import { ApiProperty } from '@nestjs/swagger';
import { PropertyDetailDto } from '../../common/dto/property-detail.dto';

export class PropertyOwnerViewDto extends PropertyDetailDto {
  @ApiProperty() isPublished: boolean;
}