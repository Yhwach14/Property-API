import * as typeorm from 'typeorm';
import { PropertyType } from '../../common/enums/property-type.enum';
import { PricePeriod } from '../../common/enums/price-period.enum';
import { ColumnNumericTransformer } from '../../common/transformers/column-numeric.transformer';

import { Users } from '../../users/entities/users.entity';
import { Amenity } from '../../amenities/entities/amenity.entity';
import { PropertyImage } from '../entities/property-image.entity';

@typeorm.Entity('properties')
export class Property {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  @typeorm.Column({ type: 'varchar', length: 120 })
  title: string;

  @typeorm.Column('text')
  description: string;

  @typeorm.Index()
  @typeorm.Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.OTHER,
  })
  type: PropertyType;

  @typeorm.Column({
    type: 'enum',
    enum: PricePeriod,
    default: PricePeriod.PER_NIGHT,
  })
  pricePeriod: PricePeriod;

  @typeorm.Index()
  @typeorm.Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @typeorm.Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @typeorm.Index()
  @typeorm.Column({ type: 'varchar', length: 100 })
  city: string;

  @typeorm.Column({ type: 'varchar', length: 255 })
  address: string;

  @typeorm.Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @typeorm.Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @typeorm.Column({ type: 'int' })
  bedrooms: number;

  @typeorm.Column({ type: 'int' })
  bathrooms: number;

  @typeorm.Column({ type: 'int' })
  maxGuests: number;

  @typeorm.Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string | null;

  @typeorm.Column({ type: 'varchar', length: 30, nullable: true })
  contactPhone: string | null;

  @typeorm.Column({ default: false })
  isPublished: boolean;

  @typeorm.Column({ type: 'uuid' })
  ownerId: string;

  @typeorm.ManyToOne(() => Users, { nullable: false })
  @typeorm.JoinColumn({ name: 'ownerId' })
  owner: Users;

  @typeorm.ManyToMany(() => Amenity)
  @typeorm.JoinTable({ name: 'property_amenities' })
  amenities: Amenity[];

  @typeorm.OneToMany(() => PropertyImage, (image) => image.property)
  images: PropertyImage[];

  @typeorm.CreateDateColumn()
  createdAt: Date;

  @typeorm.UpdateDateColumn()
  updatedAt: Date;

  @typeorm.DeleteDateColumn()
  deletedAt: Date | null;
}
