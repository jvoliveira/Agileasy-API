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

  it('should create prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: {
          observacao: 'Quero que faça isso com urgência',
          metodoPagamento: {
            id: 1,
          },
          prestador: {
            id: 1,
          },
          endereco: {
            id: 1,
          },
          cliente: {
            id: 1,
          },
          servicos: [
            {
              id: 1,
            },
          ],
          situacoes: [
            {
              data: '2020-10-24T18:55:31.653Z',
              estado: 0,
              id: 1,
              ativo: true,
            },
          ],
          subtotal: 25,
          id: 1,
          ativo: true,
        },
      },
    }
    service.create.mockResolvedValue(shouldReturn.data.pedido as any)
    serviceSevicos.getByID.mockResolvedValue({ valor: 25, id: 1 } as any)
    await expect(
      controller.newPedido(shouldReturn.data.pedido as any),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
