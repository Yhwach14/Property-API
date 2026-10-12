import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PropertyListItemDto } from '../common/dto/property-list-item.dto';
import { ListPropertiesQueryDto } from './dto/list-properties-query.dto';
import { PropertyDetailDto } from '../common/dto/property-detail.dto';
import { CurrentUser } from '../auth/decorators';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Body, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators';
import { Role } from '../common/enums/role.enum';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PropertyOwnerViewDto } from './dto/property-owner-view.dto';
import { Patch } from '@nestjs/common';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Delete, HttpCode, HttpStatus } from '@nestjs/common';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOkResponse({ type: PropertyListItemDto, isArray: true })
  findAll(@Query() query: ListPropertiesQueryDto) {
    return this.propertiesService.findPublished(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: PropertyDetailDto })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOnePublished(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PropertyOwnerViewDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  create(@Body() dto: CreatePropertyDto, @CurrentUser() user: { id: string }) {
    return this.propertiesService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOwnerViewDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.propertiesService.update(id, dto, user.id, user.role);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.propertiesService.remove(id, user.id, user.role);
  }
}
