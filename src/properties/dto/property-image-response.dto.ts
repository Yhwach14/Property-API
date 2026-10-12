import { ApiProperty } from '@nestjs/swagger';

export class PropertyImageResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() url: string;
  @ApiProperty() sortOrder: number;
  @ApiProperty() isCover: boolean;
}