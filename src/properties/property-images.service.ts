import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { Role } from '../common/enums/role.enum';
import { STORAGE_SERVICE, StorageService } from '../storage/storage.service';
import { detectImageType } from '../common/utils/detect-image-type';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateImageDto } from './dto/update-image.dto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES_PER_PROPERTY = 10;

@Injectable()
export class PropertyImagesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepo: Repository<Property>,
    @InjectRepository(PropertyImage)
    private readonly imagesRepo: Repository<PropertyImage>,
    @Inject(STORAGE_SERVICE)
    private readonly storage: StorageService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  private async loadOwnedProperty(
    propertyId: string,
    userId: string,
    userRole: Role,
  ): Promise<Property> {
    const property = await this.propertiesRepo.findOne({
      where: { id: propertyId },
      relations: { images: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this property');
    }
    return property;
  }

  private async loadOwnedImage(
    propertyId: string,
    imageId: string,
    userId: string,
    userRole: Role,
  ): Promise<{ property: Property; image: PropertyImage }> {
    const property = await this.loadOwnedProperty(propertyId, userId, userRole);
    const image = property.images.find((img) => img.id === imageId);
    if (!image) {
      throw new NotFoundException('Image not found on this property');
    }
    return { property, image };
  }

  async update(
    propertyId: string,
    imageId: string,
    dto: UpdateImageDto,
    userId: string,
    userRole: Role,
  ): Promise<PropertyImage> {
    const { image } = await this.loadOwnedImage(
      propertyId,
      imageId,
      userId,
      userRole,
    );

    if (dto.sortOrder !== undefined) {
      image.sortOrder = dto.sortOrder;
    }

    if (dto.isCover === true && !image.isCover) {
      // Unset the old cover and set the new one in one transaction, so the
      // partial unique index above is never violated mid-update.
      return this.dataSource.transaction(async (manager) => {
        await manager.update(
          PropertyImage,
          { propertyId, isCover: true },
          { isCover: false },
        );
        image.isCover = true;
        return manager.save(image);
      });
    }

    if (dto.isCover === false) {
      image.isCover = false;
    }

    return this.imagesRepo.save(image);
  }

  async remove(
    propertyId: string,
    imageId: string,
    userId: string,
    userRole: Role,
  ): Promise<void> {
    const { property, image } = await this.loadOwnedImage(
      propertyId,
      imageId,
      userId,
      userRole,
    );

    await this.imagesRepo.remove(image);
    await this.storage.delete(image.storageKey);

    if (image.isCover) {
      const remaining = property.images
        .filter((img) => img.id !== imageId)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (remaining.length) {
        await this.imagesRepo.update(remaining[0].id, { isCover: true });
      }
    }
  }

  async upload(
    propertyId: string,
    file: { buffer: Buffer; size: number } | undefined,
    userId: string,
    userRole: Role,
  ): Promise<PropertyImage> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File exceeds the 5 MB limit');
    }

    const property = await this.loadOwnedProperty(propertyId, userId, userRole);

    if (property.images.length >= MAX_IMAGES_PER_PROPERTY) {
      throw new BadRequestException(
        `A property can have at most ${MAX_IMAGES_PER_PROPERTY} images`,
      );
    }

    const detected = detectImageType(file.buffer);
    if (!detected) {
      throw new BadRequestException(
        'File must be a valid JPEG, PNG, or WebP image',
      );
    }

    const storageKey = `${randomUUID()}.${detected.ext}`;
    await this.storage.save(file.buffer, storageKey);

    const isFirstImage = property.images.length === 0;
    const nextSortOrder = property.images.length
      ? Math.max(...property.images.map((img) => img.sortOrder)) + 1
      : 0;

    const image = this.imagesRepo.create({
      propertyId: property.id,
      url: this.storage.getPublicUrl(storageKey),
      storageKey,
      sortOrder: nextSortOrder,
      isCover: isFirstImage,
    });

    return this.imagesRepo.save(image);
  }
}
