import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiabilityService } from './liability.service';
import { CreateLiabilityDto } from './dto/create-liability.dto';
import { UpdateLiabilityDto } from './dto/update-liability.dto';

@Controller('liability')
export class LiabilityController {
  constructor(private readonly liabilityService: LiabilityService) {}

  @Post()
  create(@Body() createLiabilityDto: CreateLiabilityDto) {
    return this.liabilityService.create(createLiabilityDto);
  }

  @Get()
  findAll() {
    return this.liabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liabilityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLiabilityDto: UpdateLiabilityDto) {
    return this.liabilityService.update(+id, updateLiabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liabilityService.remove(+id);
  }
}
