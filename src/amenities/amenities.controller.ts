import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AmenitiesService } from './amenities.service';
import { AmenityResponseDto } from './dto/amenity-response.dto';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators';
import { Role } from '../common/enums/role.enum';

@ApiTags('amenities')
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get()
  @ApiOkResponse({ type: AmenityResponseDto, isArray: true })
  async findAll(): Promise<AmenityResponseDto[]> {
    const amenities = await this.amenitiesService.findAll();
    return amenities.map(({ id, slug, name }) => ({ id, slug, name }));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AmenityResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  create(@Body() dto: CreateAmenityDto): Promise<AmenityResponseDto> {
    return this.amenitiesService.create(dto);
  }
}