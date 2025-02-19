import { Test, TestingModule } from '@nestjs/testing';
import { FinancialDataController } from './financial-data.controller';
import { FinancialDataService } from './financial-data.service';

describe('FinancialDataController', () => {
  let controller: FinancialDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialDataController],
      providers: [FinancialDataService],
    }).compile();

    controller = module.get<FinancialDataController>(FinancialDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
