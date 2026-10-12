import { ApiProperty } from '@nestjs/swagger';

export class AmenityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
}