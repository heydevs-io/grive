import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities';
import { CreateUserDto, UserResponseDto } from './dto';
import { UserStatus } from '@enums';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async getUserByEmail(email: string) {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.businessProfile', 'businessProfile')
      .where('user.email = :email', { email })
      .getOne();

    return result;
  }

  async getUserById(id: string) {
    const result = await this.userRepository.findOne({ where: { id } });
    return result;
  }

  async updateStatus(id: string, status: UserStatus) {
    return await this.userRepository.update(id, { status });
  }
}
