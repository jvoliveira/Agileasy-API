import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Servico } from '../models/servicos/servico.entity'
import { ServicosService } from './servicos.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Repository } from 'typeorm'

describe('ServicosService', () => {
  let service: ServicosService
  const repo = createMock<Repository<Servico>>()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        {
          provide: getRepositoryToken(Servico),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<ServicosService>(ServicosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
