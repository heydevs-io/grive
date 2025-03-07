import { User } from '@entities';
import { UserStatus } from '@enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';

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

  async updateUser(id: string, data: UpdateUserDto) {
    const result = await this.userRepository.update(id, data);
    if (result.affected === 0) {
      throw new BadRequestException('Failed to update user');
    }
    return {
      isUpdated: true,
    };
  }
}
