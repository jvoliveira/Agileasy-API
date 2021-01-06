import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { ServicosService } from '../servicos/servicos.service'
import { PedidosController } from './pedidos.controller'
import { PedidosService } from './pedidos.service'
import * as moment from 'moment-timezone'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'
import { EnderecosService } from '../enderecos/enderecos.service'
import { Estado } from '../../models/situacoes/situacao.interface'
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin'
import { ClientesService } from '../clientes/clientes.service'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { MailManager } from '../../common/mails/mail.manager'
import { CuponsService } from '../cupons/cupons.service'
import { MetodosPagamentoService } from '../metodospagamento/metodos-pagamento.service'
import { CieloConfigService } from '../../config/cielo/config.service'
import { TipoPagamento } from '../../models/metodos-pagamento/metodo-pagamento.interface'

describe('PedidosController', () => {
  let controller: PedidosController
  const service = createMock<PedidosService>()
  const serviceSevicos = createMock<ServicosService>()
  const userService = createMock<UserService>()
  const enderecoService = createMock<EnderecosService>()
  const clienteService = createMock<ClientesService>()
  const prestadorService = createMock<PrestadoresService>()
  const mockMetodosPagamentoService = createMock<MetodosPagamentoService>()
  const cupomService = createMock<CuponsService>()
  const mockFirebaseNotification = createMock<FirebaseMessagingService>()
  const mockCieloConfigService = createMock<CieloConfigService>()
  const mockMailManager = createMock<MailManager>()

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
        {
          provide: FirebaseMessagingService,
          useValue: mockFirebaseNotification,
        },
        {
          provide: CieloConfigService,
          useValue: mockCieloConfigService,
        },
        {
          provide: MetodosPagamentoService,
          useValue: mockMetodosPagamentoService,
        },
        {
          provide: PrestadoresService,
          useValue: prestadorService,
        },
        {
          provide: ClientesService,
          useValue: clienteService,
        },
        {
          provide: MailManager,
          useValue: mockMailManager,
        },
        {
          provide: CuponsService,
          useValue: cupomService,
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
          emDomicilio: true,
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
              delivery: true,
              noEstabelecimento: true,
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
    prestadorService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)
    mockFirebaseNotification.send.mockReturnThis()
    service.novoPedido.mockResolvedValue(shouldReturn.data.pedido as any)
    mockMetodosPagamentoService.getByID.mockResolvedValue({
      tipoPagamento: TipoPagamento.dinheiro,
    } as any)
    serviceSevicos.getByIdWithPrestador.mockResolvedValue({
      valor: 25,
      id: 1,
      delivery: true,
      noEstabelecimento: true,
      prestador: {
        id: 1,
      },
    } as any)
    enderecoService.getByIdWithClienteAndPrestador.mockResolvedValue({
      endereco1: 'Rua não sei o que',
      cliente: {
        id: 1,
      },
    } as any)
    const mockUser = createMock<admin.auth.UserRecord>()
    mockMailManager.sendEmail.mockReturnThis()
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
          cliente: {
            id: 1,
          },
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

    clienteService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)
    mockFirebaseNotification.send.mockReturnThis()

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'

    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)

    service.getByIdAsPrestador.mockResolvedValue(
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

  it('should mark as finalizado', async () => {
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
          cliente: {
            id: 1,
          },
          metodoPagamento: {
            id: 1,
            ativo: true,
            tipoPagamento: 0,
          },
          situacoes: [
            {
              id: 1,
              ativo: true,
              estado: Estado.solicitado,
              data: '2020-11-05T14:17:07.312Z',
            },
            {
              id: 2,
              ativo: true,
              estado: Estado.aceito,
              data: '2020-11-05T19:17:07.312Z',
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

    clienteService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)
    mockFirebaseNotification.send.mockReturnThis()

    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)

    service.getByIdAsPrestador.mockResolvedValue(
      shouldReturn.data.pedido as any,
    )

    shouldReturn.data.pedido.situacoes.push({
      data: '2020-11-09T20:26:38.185Z',
      estado: Estado.andamento,
      id: 3,
      ativo: true,
    })
    service.changeSituacao.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(
      controller.markAsFinalizado(1, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should mark as aceito', async () => {
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
              estado: Estado.solicitado,
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
          cliente: {
            id: 1,
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

    clienteService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)
    mockFirebaseNotification.send.mockReturnThis()

    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)

    service.getByIdAsPrestador.mockResolvedValue(
      shouldReturn.data.pedido as any,
    )

    service.changeSituacao.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(controller.markAsAceito(1, mockUser)).resolves.toStrictEqual(
      shouldReturn,
    )
  })

  it('should mark as rejeitado', async () => {
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
          cliente: {
            id: 1,
          },
          metodoPagamento: {
            id: 1,
            ativo: true,
            tipoPagamento: 0,
          },
          situacoes: [
            {
              id: 1,
              ativo: true,
              estado: Estado.solicitado,
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

    clienteService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)

    mockFirebaseNotification.send.mockReturnThis()

    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)

    service.getByIdAsPrestador.mockResolvedValue(
      shouldReturn.data.pedido as any,
    )

    service.changeSituacao.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(
      controller.markAsRejeitado(1, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should mark cancelado prestador', async () => {
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
          cliente: {
            id: 1,
          },
          metodoPagamento: {
            id: 1,
            ativo: true,
            tipoPagamento: 0,
          },
          situacoes: [
            {
              id: 1,
              ativo: true,
              estado: Estado.solicitado,
              data: '2020-11-05T14:17:07.312Z',
            },
            {
              id: 2,
              ativo: true,
              estado: Estado.aceito,
              data: '2020-11-05T14:19:07.312Z',
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

    clienteService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)

    mockFirebaseNotification.send.mockReturnThis()

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'

    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)

    service.getByIdAsPrestador.mockResolvedValue(
      shouldReturn.data.pedido as any,
    )

    service.changeSituacao.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(
      controller.cancelarPedidoAsPrestador(1, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should mark cancelado cliente', async () => {
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
          prestador: {
            id: 1,
          },
          metodoPagamento: {
            id: 1,
            ativo: true,
            tipoPagamento: 0,
          },
          situacoes: [
            {
              id: 1,
              ativo: true,
              estado: Estado.solicitado,
              data: '2020-11-05T14:17:07.312Z',
            },
            {
              id: 2,
              ativo: true,
              estado: Estado.aceito,
              data: '2020-11-05T14:19:07.312Z',
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

    prestadorService.getByID.mockResolvedValue({
      usuario: { tokenNotificacao: 'TESTE' },
    } as any)

    mockFirebaseNotification.send.mockReturnThis()

    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)

    service.getByIdAsCliente.mockResolvedValue(shouldReturn.data.pedido as any)

    service.changeSituacao.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(
      controller.cancelarPedidoAsCliente(1, mockUser),
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
                estado: Estado.aceito,
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

  it('should get pedido as cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: {
          id: 1,
          ativo: true,
          subtotal: 30,
          observacao: 'Quero estrelinha.',
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
              data: '2020-11-10T21:44:00.000Z',
            },
            {
              id: 2,
              ativo: true,
              estado: 1,
              data: '2020-11-13T18:18:25.388Z',
            },
            {
              id: 3,
              ativo: true,
              estado: 3,
              data: '2020-11-13T18:18:58.946Z',
            },
            {
              id: 4,
              ativo: true,
              estado: 6,
              data: '2020-11-13T18:19:03.102Z',
            },
          ],
          endereco: {
            id: 3,
            ativo: true,
            apelido: 'Casa',
            endereco: 'Green Stravenue',
            complemento: 'Hill',
            numero: 223,
            cidade: 'Itaperuna',
            estado: 'RJ',
            cep: '28300-000',
            referencia: null,
            favorito: false,
          },
          servicos: [
            {
              id: 2,
              ativo: true,
              descricao: 'Corte popular de cabelo',
              valor: 30,
              nome: 'Corte de cabelo',
              urlFoto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/Dyed-Udon-with-Shaved-Hairline-702x1024.jpg',
            },
          ],
          dataHora: '2021-02-11T14:30:00.000Z',
          cliente: {
            id: 1,
            ativo: true,
            usuario: {
              id: 2,
              ativo: true,
              nome: 'Joao Picanco',
              nomeSocial: 'Jaozin',
              dataNascimento: '1987-06-27T03:00:00.000Z',
              telefone: '22998047269',
              cpf: '678.532.458-87',
              token: 't0V7MEE9kiTP2f7T6la9WIedxee2',
              status: 0,
              foto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/estilo-geek-masculino7.jpg',
            },
          },
          prestador: {
            id: 1,
            ativo: true,
            usuario: {
              id: 1,
              ativo: true,
              nome: 'Alice Medeiros',
              nomeSocial: 'Lice',
              dataNascimento: '1999-03-25T03:00:00.000Z',
              telefone: '22998047269',
              cpf: '010.677.458-23',
              token: '1I80WG9tuUTIRS3XW8Z6627XYkB2',
              status: 0,
              foto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/maquiadora.jpg',
            },
            cnpj: '',
            delivery: true,
            documentoUrl:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/Nova-Carteira-de-Identidade_site.jpg',
            nomePublico: 'Unhas da Alice',
            razaoSocial: '',
            tipoPessoa: 0,
            logo:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/unhas-decoradas-alice-no-pai%CC%81s-das-maravilhas-4.jpg',
            nota: 4.3,
            capa:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/capa-maquiagem-blog.png?alt=media',
          },
          avaliacoes: [],
        },
      },
    }

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    service.getByIdAsCliente.mockResolvedValue(shouldReturn.data.pedido as any)

    await expect(
      controller.getByIdAsCliente(1, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should get pedido as prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: {
          id: 1,
          ativo: true,
          subtotal: 30,
          observacao: 'Quero estrelinha.',
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
              data: '2020-11-10T21:44:00.000Z',
            },
            {
              id: 2,
              ativo: true,
              estado: 1,
              data: '2020-11-13T18:18:25.388Z',
            },
            {
              id: 3,
              ativo: true,
              estado: 3,
              data: '2020-11-13T18:18:58.946Z',
            },
            {
              id: 4,
              ativo: true,
              estado: 6,
              data: '2020-11-13T18:19:03.102Z',
            },
          ],
          endereco: {
            id: 3,
            ativo: true,
            apelido: 'Casa',
            endereco: 'Green Stravenue',
            complemento: 'Hill',
            numero: 223,
            cidade: 'Itaperuna',
            estado: 'RJ',
            cep: '28300-000',
            referencia: null,
            favorito: false,
          },
          servicos: [
            {
              id: 2,
              ativo: true,
              descricao: 'Corte popular de cabelo',
              valor: 30,
              nome: 'Corte de cabelo',
              urlFoto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/Dyed-Udon-with-Shaved-Hairline-702x1024.jpg',
            },
          ],
          dataHora: '2021-02-11T14:30:00.000Z',
          cliente: {
            id: 1,
            ativo: true,
            usuario: {
              id: 2,
              ativo: true,
              nome: 'Joao Picanco',
              nomeSocial: 'Jaozin',
              dataNascimento: '1987-06-27T03:00:00.000Z',
              telefone: '22998047269',
              cpf: '678.532.458-87',
              token: 't0V7MEE9kiTP2f7T6la9WIedxee2',
              status: 0,
              foto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/estilo-geek-masculino7.jpg',
            },
          },
          prestador: {
            id: 1,
            ativo: true,
            usuario: {
              id: 1,
              ativo: true,
              nome: 'Alice Medeiros',
              nomeSocial: 'Lice',
              dataNascimento: '1999-03-25T03:00:00.000Z',
              telefone: '22998047269',
              cpf: '010.677.458-23',
              token: '1I80WG9tuUTIRS3XW8Z6627XYkB2',
              status: 0,
              foto:
                'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/maquiadora.jpg',
            },
            cnpj: '',
            delivery: true,
            documentoUrl:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/Nova-Carteira-de-Identidade_site.jpg',
            nomePublico: 'Unhas da Alice',
            razaoSocial: '',
            tipoPessoa: 0,
            logo:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/unhas-decoradas-alice-no-pai%CC%81s-das-maravilhas-4.jpg',
            nota: 4.3,
            capa:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/capa-maquiagem-blog.png?alt=media',
          },
          avaliacoes: [],
        },
      },
    }

    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    service.getByIdAsPrestador.mockResolvedValue(
      shouldReturn.data.pedido as any,
    )

    await expect(
      controller.getByIdAsPrestador(1, mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
