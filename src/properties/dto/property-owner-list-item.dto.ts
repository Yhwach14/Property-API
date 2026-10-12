import { ApiProperty } from '@nestjs/swagger';
import { PropertyListItemDto } from '../../common/dto/property-list-item.dto';

export class PropertyOwnerListItemDto extends PropertyListItemDto {
  @ApiProperty() isPublished: boolean;
}