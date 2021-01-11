import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Informacao } from '../../models/informacao/informacao.entity'
import { InformacoesService } from './informacoes.service'

describe('InformacoesService', () => {
  let service: InformacoesService
  const repo = createMock<Repository<Informacao>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformacoesService,
        {
          provide: getRepositoryToken(Informacao),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<InformacoesService>(InformacoesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
