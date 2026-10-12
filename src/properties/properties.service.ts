import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { Amenity } from '../amenities/entities/amenity.entity';
import { Role } from '../common/enums/role.enum';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { PropertyListItemDto } from '../common/dto/property-list-item.dto';
import { PropertyDetailDto } from '../common/dto/property-detail.dto';
import { PropertyOwnerViewDto } from './dto/property-owner-view.dto';
import { ListPropertiesQueryDto } from './dto/list-properties-query.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertySortBy } from '../common/enums/property-sortby.enum';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyOwnerListItemDto } from './dto/property-owner-list-item.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';


@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepo: Repository<Property>,
    @InjectRepository(Amenity)
    private readonly amenitiesRepo: Repository<Amenity>,
  ) {}

  async findPublished(
    query: ListPropertiesQueryDto,
  ): Promise<PaginatedResponse<PropertyListItemDto>> {
    const {
      page,
      pageSize,
      type,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      amenities,
      q,
      sortBy,
      sortOrder,
    } = query;

    const qb = this.propertiesRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect(
        'property.images',
        'coverImage',
        'coverImage.isCover = true',
      )
      .where('property.isPublished = true');

    if (type) {
      qb.andWhere('property.type = :type', { type });
    }
    if (city) {
      qb.andWhere('LOWER(property.city) = LOWER(:city)', { city });
    }
    if (minPrice !== undefined) {
      qb.andWhere('property.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb.andWhere('property.price <= :maxPrice', { maxPrice });
    }
    if (bedrooms !== undefined) {
      qb.andWhere('property.bedrooms >= :bedrooms', { bedrooms });
    }
    if (q) {
      const escaped = q.replace(/[%_]/g, (c) => `\\${c}`);
      qb.andWhere(
        '(property.title ILIKE :q OR property.city ILIKE :q OR property.description ILIKE :q)',
        { q: `%${escaped}%` },
      );
    }
    if (amenities?.length) {
      qb.andWhere(
        `property.id IN (
          SELECT pa."propertiesId" FROM property_amenities pa
          INNER JOIN amenities a ON a.id = pa."amenitiesId"
          WHERE a.slug IN (:...amenities)
          GROUP BY pa."propertiesId"
          HAVING COUNT(DISTINCT a.slug) = :amenityCount
        )`,
        { amenities, amenityCount: amenities.length },
      );
    }

    const sortColumn = sortBy ?? PropertySortBy.CREATED_AT;
    qb.orderBy(`property.${sortColumn}`, sortOrder ?? 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [properties, totalItems] = await qb.getManyAndCount();

    const data: PropertyListItemDto[] = properties.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      price: p.price,
      currency: p.currency,
      pricePeriod: p.pricePeriod,
      city: p.city,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      maxGuests: p.maxGuests,
      coverImageUrl: p.images?.[0]?.url ?? null,
    }));

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findOnePublished(id: string): Promise<PropertyDetailDto> {
    const property = await this.propertiesRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.amenities', 'amenity')
      .leftJoinAndSelect('property.images', 'image')
      .leftJoinAndSelect('property.owner', 'owner')
      .where('property.id = :id', { id })
      .andWhere('property.isPublished = true')
      .getOne();

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const images = [...property.images].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    return {
      id: property.id,
      title: property.title,
      type: property.type,
      price: property.price,
      currency: property.currency,
      pricePeriod: property.pricePeriod,
      city: property.city,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      maxGuests: property.maxGuests,
      description: property.description,
      address: property.address,
      latitude: property.latitude,
      longitude: property.longitude,
      amenities: property.amenities.map(({ id, slug, name }) => ({
        id,
        slug,
        name,
      })),
      images: images.map(({ id, url, sortOrder, isCover }) => ({
        id,
        url,
        sortOrder,
        isCover,
      })),
      contactEmail: property.contactEmail ?? property.owner.email,
      contactPhone: property.contactPhone,
      owner: {
        id: property.owner.id,
        firstName: property.owner.firstName,
        lastName: property.owner.lastName,
      },
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }

  async findOwnedById(
    id: string,
    userId: string,
    userRole: Role,
  ): Promise<PropertyOwnerViewDto> {
    const property = await this.propertiesRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.amenities', 'amenity')
      .leftJoinAndSelect('property.images', 'image')
      .leftJoinAndSelect('property.owner', 'owner')
      .where('property.id = :id', { id })
      .getOne();

    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this property');
    }

    const images = [...property.images].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    return {
      id: property.id,
      title: property.title,
      type: property.type,
      price: property.price,
      currency: property.currency,
      pricePeriod: property.pricePeriod,
      city: property.city,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      maxGuests: property.maxGuests,
      description: property.description,
      address: property.address,
      latitude: property.latitude,
      longitude: property.longitude,
      amenities: property.amenities.map(({ id, slug, name }) => ({
        id,
        slug,
        name,
      })),
      images: images.map(({ id, url, sortOrder, isCover }) => ({
        id,
        url,
        sortOrder,
        isCover,
      })),
      contactEmail: property.contactEmail ?? property.owner.email,
      contactPhone: property.contactPhone,
      owner: {
        id: property.owner.id,
        firstName: property.owner.firstName,
        lastName: property.owner.lastName,
      },
      isPublished: property.isPublished,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }

  async create(
    dto: CreatePropertyDto,
    ownerId: string,
  ): Promise<PropertyOwnerViewDto> {
    let amenities: Amenity[] = [];
    if (dto.amenityIds?.length) {
      amenities = await this.amenitiesRepo.findBy({ id: In(dto.amenityIds) });
      const foundIds = new Set(amenities.map((a) => a.id));
      const missing = dto.amenityIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        throw new BadRequestException({
          message: 'One or more amenity ids do not exist',
          details: missing,
        });
      }
    }

    const property = this.propertiesRepo.create({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      pricePeriod: dto.pricePeriod,
      price: dto.price,
      currency: dto.currency ?? 'USD',
      city: dto.city,
      address: dto.address,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      maxGuests: dto.maxGuests,
      contactEmail: dto.contactEmail ?? null,
      contactPhone: dto.contactPhone ?? null,
      isPublished: dto.isPublished ?? false,
      ownerId,
      amenities,
    });

    const saved = await this.propertiesRepo.save(property);
    return this.findOwnedById(saved.id, ownerId, Role.OWNER);
  }

  async update(
    id: string,
    dto: UpdatePropertyDto,
    userId: string,
    userRole: Role,
  ): Promise<PropertyOwnerViewDto> {
    const property = await this.propertiesRepo.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this property');
    }

    // amenityIds: undefined = leave as-is, [] = clear, array = replace
    if (dto.amenityIds !== undefined) {
      let amenities: Amenity[] = [];
      if (dto.amenityIds.length) {
        amenities = await this.amenitiesRepo.findBy({ id: In(dto.amenityIds) });
        const foundIds = new Set(amenities.map((a) => a.id));
        const missing = dto.amenityIds.filter(
          (amenityId) => !foundIds.has(amenityId),
        );
        if (missing.length) {
          throw new BadRequestException({
            message: 'One or more amenity ids do not exist',
            details: missing,
          });
        }
      }
      property.amenities = amenities;
    }

    const { amenityIds, ...rest } = dto;
    Object.assign(property, rest);

    await this.propertiesRepo.save(property);
    return this.findOwnedById(id, userId, userRole);
  }
  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const property = await this.propertiesRepo.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this property');
    }

    await this.propertiesRepo.softRemove(property);
  }
  async findOwnedList(
  ownerId: string,
  query: PaginationQueryDto,
): Promise<PaginatedResponse<PropertyOwnerListItemDto>> {
  const { page, pageSize } = query;

  const [properties, totalItems] = await this.propertiesRepo
    .createQueryBuilder('property')
    .leftJoinAndSelect(
      'property.images',
      'coverImage',
      'coverImage.isCover = true',
    )
    .where('property.ownerId = :ownerId', { ownerId })
    .orderBy('property.createdAt', 'DESC')
    .skip((page - 1) * pageSize)
    .take(pageSize)
    .getManyAndCount();

  const data: PropertyOwnerListItemDto[] = properties.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    price: p.price,
    currency: p.currency,
    pricePeriod: p.pricePeriod,
    city: p.city,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    maxGuests: p.maxGuests,
    coverImageUrl: p.images?.[0]?.url ?? null,
    isPublished: p.isPublished,
  }));

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    },
  };
}
}
