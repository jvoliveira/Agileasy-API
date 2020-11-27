import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { MetodosPagamentoController } from './metodos-pagamento.controller'
import { MetodosPagamentoService } from './metodos-pagamento.service'

describe('MetodospagamentoController', () => {
  let controller: MetodosPagamentoController
  const service = createMock<MetodosPagamentoService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosPagamentoController],
      providers: [
        {
          provide: MetodosPagamentoService,
          useValue: service,
        },
      ],
    }).compile()

    controller = module.get<MetodosPagamentoController>(
      MetodosPagamentoController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
