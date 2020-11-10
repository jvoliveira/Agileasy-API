import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { ServicosService } from '../servicos/servicos.service'
import { PedidosController } from './pedidos.controller'
import { PedidosService } from './pedidos.service'
import * as moment from 'moment-timezone'
import { UserService } from '../../common/services/user.service'
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

  it('should get todos pedidos as prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        pedidos: [
          {
            id: 1,
            ativo: true,
            subtotal: 25,
            observacao: 'Quero que faça isso com urgência',
            metodoPagamento: {
              id: 1,
              ativo: true,
              tipoPagamento: 0,
            },
            situacoes: [
              {
                id: 1,
                ativo: true,
                estado: 0,
                data: '2020-11-05T14:17:07.312Z',
              },
            ],
            endereco: {
              id: 2,
              ativo: true,
              apelido: 'Casa',
              endereco: 'Rua Euclides Poubel de Lima',
              complemento: 'Apto',
              numero: 125,
              cidade: 'Itaperuna',
              estado: 'RJ',
              cep: '28300-000',
              referencia: 'Ao lado casa da mercearia',
            },
            servicos: [
              {
                id: 1,
                ativo: true,
                descricao: 'Serviço completo de pé e mão',
                valor: 25,
                nome: 'Pé e mão',
                urlFoto:
                  'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/download.jpeg',
              },
            ],
            dataHora: '2030-10-24T13:12:32.162Z',
          },
        ],
      },
    }

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    service.getPedidosAsPrestador.mockResolvedValue(
      shouldReturn.data.pedidos as any,
    )

    await expect(
      controller.myPedidosAsPrestador(mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should mark as em andamento', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: {
          id: 1,
          ativo: true,
          subtotal: 25,
          observacao: 'Quero que faça isso com urgência',
          metodoPagamento: {
            id: 1,
            ativo: true,
            tipoPagamento: 0,
          },
          situacoes: [
            {
              id: 1,
              ativo: true,
              estado: 0,
              data: '2020-11-05T14:17:07.312Z',
            },
          ],
          endereco: {
            id: 2,
            ativo: true,
            apelido: 'Casa',
            endereco: 'Rua Euclides Poubel de Lima',
            complemento: 'Apto',
            numero: 125,
            cidade: 'Itaperuna',
            estado: 'RJ',
            cep: '28300-000',
            referencia: 'Ao lado casa da mercearia',
          },
          servicos: [
            {
              id: 1,
              ativo: true,
              descricao: 'Serviço completo de pé e mão',
              valor: 25,
              nome: 'Pé e mão',
              urlFoto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/download.jpeg',
            },
          ],
          dataHora: '2030-10-24T13:12:32.162Z',
        },
      },
    }

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'

    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)

    service.getByPedidoAndPrestadorId.mockResolvedValue(
      shouldReturn.data.pedido as any,
    )

    shouldReturn.data.pedido.situacoes.push({
      data: '2020-11-09T20:26:38.185Z',
      estado: 1,
      id: 2,
      ativo: true,
    })
    service.changeSituacao.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(
      controller.markAsEmAndamento(1, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should get todos pedidos as cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        pedidos: [
          {
            id: 1,
            ativo: true,
            subtotal: 25,
            observacao: 'Quero que faça isso com urgência',
            metodoPagamento: {
              id: 1,
              ativo: true,
              tipoPagamento: 0,
            },
            situacoes: [
              {
                id: 1,
                ativo: true,
                estado: 0,
                data: '2020-11-05T14:17:07.312Z',
              },
            ],
            endereco: {
              id: 2,
              ativo: true,
              apelido: 'Casa',
              endereco: 'Rua Euclides Poubel de Lima',
              complemento: 'Apto',
              numero: 125,
              cidade: 'Itaperuna',
              estado: 'RJ',
              cep: '28300-000',
              referencia: 'Ao lado casa da mercearia',
            },
            servicos: [
              {
                id: 1,
                ativo: true,
                descricao: 'Serviço completo de pé e mão',
                valor: 25,
                nome: 'Pé e mão',
                urlFoto:
                  'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/download.jpeg',
              },
            ],
            dataHora: '2030-10-24T13:12:32.162Z',
          },
        ],
      },
    }

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    service.getPedidosAsCliente.mockResolvedValue(
      shouldReturn.data.pedidos as any,
    )

    await expect(
      controller.myPedidosAsCliente(mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
