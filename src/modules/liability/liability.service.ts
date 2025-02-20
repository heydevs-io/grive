import { Injectable } from '@nestjs/common';
import { CreateLiabilityDto } from './dto/create-liability.dto';
import { UpdateLiabilityDto } from './dto/update-liability.dto';

@Injectable()
export class LiabilityService {
  create(createLiabilityDto: CreateLiabilityDto) {
    return 'This action adds a new liability';
  }

  findAll() {
    return `This action returns all liability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} liability`;
  }

  update(id: number, updateLiabilityDto: UpdateLiabilityDto) {
    return `This action updates a #${id} liability`;
  }

  remove(id: number) {
    return `This action removes a #${id} liability`;
  }
}
