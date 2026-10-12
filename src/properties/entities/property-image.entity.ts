import * as typeorm from 'typeorm';
import { Property } from './property.entity';

@typeorm.Entity('property_images')
export class PropertyImage {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  @typeorm.Column({ type: 'varchar', length: 500 })
  url: string;

  @typeorm.Column({ type: 'varchar', length: 255 })
  storageKey: string;

  @typeorm.Column({ type: 'int', default: 0 })
  sortOrder: number;

  @typeorm.Column({ default: false })
  isCover: boolean;

  @typeorm.Column({ type: 'uuid' })
  propertyId: string;

  @typeorm.ManyToOne(() => Property, (property) => property.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn({ name: 'propertyId' })
  property: Property;

  @typeorm.CreateDateColumn()
  createdAt: Date;
}