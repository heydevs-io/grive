import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioController } from './scenario.controller';
import { ScenarioService } from './scenario.service';

describe('ScenarioController', () => {
  let controller: ScenarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenarioController],
      providers: [ScenarioService],
    }).compile();

    controller = module.get<ScenarioController>(ScenarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
