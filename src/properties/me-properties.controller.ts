import { Controller, Get, Query, UseGuards,Param, ParseUUIDPipe  } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PropertyOwnerListItemDto } from './dto/property-owner-list-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators';
import { Role } from '../common/enums/role.enum';
import { ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { PropertyOwnerViewDto } from './dto/property-owner-view.dto';

@ApiTags('me')
@Controller('me/properties')
export class MePropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyOwnerListItemDto, isArray: true })
  @ApiUnauthorizedResponse()
  findMine(
    @Query() query: PaginationQueryDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.propertiesService.findOwnedList(user.id, query);
  }

  @Get(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
@ApiBearerAuth()
@ApiOkResponse({ type: PropertyOwnerViewDto })
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiNotFoundResponse()
findOne(
  @Param('id', ParseUUIDPipe) id: string,
  @CurrentUser() user: { id: string; role: Role },
) {
  return this.propertiesService.findOwnedById(id, user.id, user.role);
}
}