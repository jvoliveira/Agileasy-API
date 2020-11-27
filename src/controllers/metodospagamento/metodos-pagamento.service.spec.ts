import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { MetodoPagamento } from '../../models/metodos-pagamento/metodo-pagamento.entity'
import { MetodosPagamentoService } from './metodos-pagamento.service'
import { createMock } from '@golevelup/nestjs-testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('MetodospagamentoService', () => {
  let service: MetodosPagamentoService
  const repo = createMock<Repository<MetodoPagamento>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetodosPagamentoService,
        {
          provide: getRepositoryToken(MetodoPagamento),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<MetodosPagamentoService>(MetodosPagamentoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
