import { Test, TestingModule } from '@nestjs/testing'
import { Avaliacao } from '../../models/avaliacao/avaliacao.entity'
import { createMock } from '@golevelup/nestjs-testing'
import { AvaliacoesService } from './avaliacoes.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AvaliacoesService', () => {
  let service: AvaliacoesService
  const repo = createMock<Repository<Avaliacao>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvaliacoesService,
        {
          provide: getRepositoryToken(Avaliacao),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<AvaliacoesService>(AvaliacoesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
