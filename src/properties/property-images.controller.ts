import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PropertyImagesService } from './property-images.service';
import { PropertyImageResponseDto } from './dto/property-image-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators';
import { Role } from '../common/enums/role.enum';
import { Body, Delete, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';

@ApiTags('properties')
@Controller('properties/:id/images')
export class PropertyImagesController {
  constructor(private readonly imagesService: PropertyImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: PropertyImageResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async upload(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Parameters<PropertyImagesService['upload']>[1],
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<PropertyImageResponseDto> {
    const image = await this.imagesService.upload(id, file, user.id, user.role);
    return {
      id: image.id,
      url: image.url,
      sortOrder: image.sortOrder,
      isCover: image.isCover,
    };
  }

  @Patch(':imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PropertyImageResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Body() dto: UpdateImageDto,
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<PropertyImageResponseDto> {
    const image = await this.imagesService.update(
      id,
      imageId,
      dto,
      user.id,
      user.role,
    );
    return {
      id: image.id,
      url: image.url,
      sortOrder: image.sortOrder,
      isCover: image.isCover,
    };
  }

  @Delete(':imageId')
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
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.imagesService.remove(id, imageId, user.id, user.role);
  }
}
