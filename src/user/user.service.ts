import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const password = await bcrypt.hash(
        createUserDto.password,
        +process.env.BCRYPT_SALT_ROUNDS,
      );

      const user = this.userRepository.create({ ...createUserDto, password });
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Failed to find user');
    }
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userRepository.update({ email }, updateUserDto);

      return result;
    } catch (err) {
      console.error('Error updating user:', err);
      throw new Error('Failed to update user');
    }
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    try {
      const result = await this.userRepository.update(
        { email: updateUserRoleDto.email },
        { role: updateUserRoleDto.role },
      );

      return result;
    } catch (err) {
      console.error('Error updating user role:', err);
      throw new Error('Failed to update user role');
    }
  }

  async remove(email: string) {
    try {
      const result = await this.userRepository.delete({ email });

      return result;
    } catch (err) {
      console.error('Error removing user:', err);
      throw new Error('Failed to remove user');
    }
  }
}
