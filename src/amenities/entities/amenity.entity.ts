import * as typeorm from 'typeorm';


@typeorm.Entity('amenities')

export class Amenity {
    @typeorm.PrimaryGeneratedColumn("uuid")
    id : string;

    @typeorm.Column({ type: 'varchar', length: 100, unique: true })
    slug : string;

    @typeorm.Column({ type: 'varchar', length: 150 })
    name : string;

}