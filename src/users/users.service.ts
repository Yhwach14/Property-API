import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { Role } from '../common/enums/role.enum';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async create(input: CreateUserInput): Promise<Users> {
    const user = this.usersRepo.create({
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: Role.USER, 
    });

    try {
      return await this.usersRepo.save(user);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('An account with this email already exists');
      }
      throw err;
    }
  }

  findByEmail(email: string): Promise<Users | null> {
    return this.usersRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  findById(id: string): Promise<Users | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async updateRole(id: string, role: Role): Promise<{ id: string; email: string; role: Role }> {
  const user = await this.usersRepo.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  user.role = role;
  await this.usersRepo.save(user);
  return { id: user.id, email: user.email, role: user.role };
}
}