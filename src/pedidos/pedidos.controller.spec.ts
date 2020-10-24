import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { ServicosService } from '../servicos/servicos.service'
import { PedidosController } from './pedidos.controller'
import { PedidosService } from './pedidos.service'

describe('PedidosController', () => {
  let controller: PedidosController
  const service = createMock<PedidosService>()
  const serviceSevicos = createMock<ServicosService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        {
          provide: PedidosService,
          useValue: service,
        },
        {
          provide: ServicosService,
          useValue: serviceSevicos,
        },
      ],
    }).compile()

    controller = module.get<PedidosController>(PedidosController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
