import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { ServicosService } from '../servicos/servicos.service'
import { PedidosController } from './pedidos.controller'
import { PedidosService } from './pedidos.service'
import * as moment from 'moment-timezone'
import { UserService } from '../common/services/user.service'
import * as admin from 'firebase-admin'
import { EnderecosService } from '../enderecos/enderecos.service'

describe('PedidosController', () => {
  let controller: PedidosController
  const service = createMock<PedidosService>()
  const serviceSevicos = createMock<ServicosService>()
  const userService = createMock<UserService>()
  const enderecoService = createMock<EnderecosService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        {
          provide: PedidosService,
          useValue: service,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: EnderecosService,
          useValue: enderecoService,
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
          dataHora: moment()
            .add(10, 'minutes')
            .format(),
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
    serviceSevicos.getByIdWithPrestador.mockResolvedValue({
      valor: 25,
      id: 1,
      prestador: {
        id: 1,
      },
    } as any)
    enderecoService.getByIdWithCliente.mockResolvedValue({
      endereco1: 'Rua não sei o que',
      cliente: {
        id: 1,
      },
    } as any)
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    await expect(
      controller.newPedido(shouldReturn.data.pedido as any, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
