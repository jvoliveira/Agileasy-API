import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { Avaliacao } from '../../models/avaliacao/avaliacao.entity'
import { AvaliacoesController } from './avaliacoes.controller'
import { AvaliacoesService } from './avaliacoes.service'

describe('AvaliacoesController', () => {
  let controller: AvaliacoesController
  const service = createMock<Repository<Avaliacao>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacoesController],
      providers: [
        {
          provide: AvaliacoesService,
          useValue: service,
        },
      ],
    }).compile()

    controller = module.get<AvaliacoesController>(AvaliacoesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
