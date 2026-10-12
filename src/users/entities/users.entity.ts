import * as typeorm from 'typeorm';
import { Role } from '../../common/enums/role.enum';

@typeorm.Entity('users')

export class Users {
    @typeorm.PrimaryGeneratedColumn('uuid')
    id : string;

    @typeorm.Column({type: 'varchar',length:255, unique:true })
    email : string;

    @typeorm.Column({ type: 'varchar' , length: 255 })
    passwordHash: string;

    @typeorm.Column({ type: 'varchar' , length: 100 })
    firstName: string;

    @typeorm.Column({ type: 'varchar' , length: 100 })
    lastName: string;

    @typeorm.Column({type: 'enum', enum: Role, default: Role.USER})
    role: Role;

    @typeorm.CreateDateColumn()
    createdAt: Date;
}