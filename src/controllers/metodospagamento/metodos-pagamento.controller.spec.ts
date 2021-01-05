import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../common/services/user.service'
import { CieloConfigService } from '../../config/cielo/config.service'
import { MetodosPagamentoController } from './metodos-pagamento.controller'
import { MetodosPagamentoService } from './metodos-pagamento.service'

describe('MetodospagamentoController', () => {
  let controller: MetodosPagamentoController
  const service = createMock<MetodosPagamentoService>()
  const userService = createMock<UserService>()
  const cieloConfig = createMock<CieloConfigService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosPagamentoController],
      providers: [
        {
          provide: MetodosPagamentoService,
          useValue: service,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: CieloConfigService,
          useValue: cieloConfig,
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
