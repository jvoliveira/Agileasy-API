import { Test, TestingModule } from '@nestjs/testing'
import { Connection, Repository } from 'typeorm'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'
import { DisponibilidadesService } from './disponibilidades.service'
import { createMock } from '@golevelup/nestjs-testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('DisponibilidadesService', () => {
  let service: DisponibilidadesService
  const repo = createMock<Repository<Disponibilidade>>()
  const mockConnection = createMock<Connection>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisponibilidadesService,
        {
          provide: getRepositoryToken(Disponibilidade),
          useValue: repo,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile()

    service = module.get<DisponibilidadesService>(DisponibilidadesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
