import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'
import { DisponibilidadesService } from './disponibilidades.service'
import { createMock } from '@golevelup/nestjs-testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('DisponibilidadesService', () => {
  let service: DisponibilidadesService
  const repo = createMock<Repository<Disponibilidade>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisponibilidadesService,
        {
          provide: getRepositoryToken(Disponibilidade),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<DisponibilidadesService>(DisponibilidadesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
