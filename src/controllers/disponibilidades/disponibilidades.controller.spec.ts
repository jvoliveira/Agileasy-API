import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadesController } from './disponibilidades.controller';

describe('DisponibilidadesController', () => {
  let controller: DisponibilidadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadesController],
    }).compile();

    controller = module.get<DisponibilidadesController>(DisponibilidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
