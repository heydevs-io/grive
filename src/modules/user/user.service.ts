import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities';
import { CreateUserDto } from './dto';
import { UserStatus } from '@enums';
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
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: UserStatus) {
    return await this.userRepository.update(id, { status });
  }
}
