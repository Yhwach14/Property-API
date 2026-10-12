import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenitiesRepo: Repository<Amenity>,
  ) {}

  findAll(): Promise<Amenity[]> {
    return this.amenitiesRepo.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateAmenityDto): Promise<Amenity> {
    const amenity = this.amenitiesRepo.create(dto);
    try {
      return await this.amenitiesRepo.save(amenity);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('An amenity with this slug already exists');
      }
      throw err;
    }
  }
}