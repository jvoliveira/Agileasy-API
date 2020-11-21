import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadesService } from './disponibilidades.service';

describe('DisponibilidadesService', () => {
  let service: DisponibilidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisponibilidadesService],
    }).compile();

    service = module.get<DisponibilidadesService>(DisponibilidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
