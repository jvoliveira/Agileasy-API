import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from '../src/models/usuarios/usuario.entity'
import { Pedido } from '../src/models/pedidos/pedido.entity'
import { Servico } from '../src/models/servicos/servico.entity'
import * as moment from 'moment-timezone'
import { Endereco } from '../src/models/enderecos/endereco.entity'
import { Estado } from '../src/models/situacoes/situacao.interface'

describe('PedidoController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Pedido>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockServicosRepo = createMock<Repository<Servico>>()
  const mockEnderecoRepo = createMock<Repository<Endereco>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Pedido))
      .useValue(mockService)
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue(mockUsuarioRepo)
      .overrideProvider(getRepositoryToken(Servico))
      .useValue(mockServicosRepo)
      .overrideProvider(getRepositoryToken(Endereco))
      .useValue(mockEnderecoRepo)
      .compile()
    app = moduleFixture.createNestApplication()
    app.init()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    app.close()
  })

  it('/pedidos/criar (POST)', async () => {
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
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)
    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockServicosRepo.findOneOrFail.mockResolvedValue({
      valor: 25,
      id: 1,
      prestador: { id: 1 },
    } as any)
    mockEnderecoRepo.findOneOrFail.mockResolvedValue({
      endereco1: 'Rua não sei o que',
      cliente: {
        id: 1,
      },
    } as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1, nome: 'Vinicius' },
    } as any)
    const response = await request(app.getHttpServer())
      .post('/pedidos/novo')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/cliente/eu (GET)', async () => {
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
    mockService.find.mockResolvedValue(shouldReturn.data.pedidos as any)
    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1, nome: 'Vinicius' },
    } as any)
    const response = await request(app.getHttpServer())
      .get('/pedidos/cliente/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/prestador/eu (GET)', async () => {
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
        ],
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.pedidos as any)
    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)
    const response = await request(app.getHttpServer())
      .get('/pedidos/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/1/marcar-andamento (PUT)', async () => {
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
      },
    }
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.save(shouldReturn.data.pedido as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .put('/pedidos/1/marcar-andamento')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(200)

    const lastSituacao = shouldReturn.data.pedido.situacoes.pop()
    lastSituacao.data = moment(lastSituacao.data)
      .toDate()
      .toJSON()

    shouldReturn.data.pedido.situacoes.push(lastSituacao)

    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/1/marcar-aceito (PUT)', async () => {
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
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.save(shouldReturn.data.pedido as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .put('/pedidos/1/marcar-aceito')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(200)

    const lastSituacao = shouldReturn.data.pedido.situacoes.pop()
    lastSituacao.data = moment(lastSituacao.data)
      .toDate()
      .toJSON()

    shouldReturn.data.pedido.situacoes.push(lastSituacao)

    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/1/marcar-rejeitado (PUT)', async () => {
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
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.save(shouldReturn.data.pedido as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .put('/pedidos/1/marcar-rejeitado')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(200)

    const lastSituacao = shouldReturn.data.pedido.situacoes.pop()
    lastSituacao.data = moment(lastSituacao.data)
      .toDate()
      .toJSON()

    shouldReturn.data.pedido.situacoes.push(lastSituacao)

    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/1/marcar-finalizado (PUT)', async () => {
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
            {
              id: 2,
              ativo: true,
              estado: Estado.aceito,
              data: '2020-11-05T19:19:07.312Z',
            },
            {
              id: 3,
              ativo: true,
              estado: Estado.andamento,
              data: '2020-11-05T20:20:07.312Z',
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
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.save(shouldReturn.data.pedido as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .put('/pedidos/1/marcar-finalizado')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(200)

    const lastSituacao = shouldReturn.data.pedido.situacoes.pop()
    lastSituacao.data = moment(lastSituacao.data)
      .toDate()
      .toJSON()

    shouldReturn.data.pedido.situacoes.push(lastSituacao)

    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/1/prestador/cancelar (PUT)', async () => {
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
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.save(shouldReturn.data.pedido as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .put('/pedidos/1/prestador/cancelar')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(200)

    const lastSituacao = shouldReturn.data.pedido.situacoes.pop()
    lastSituacao.data = moment(lastSituacao.data)
      .toDate()
      .toJSON()

    shouldReturn.data.pedido.situacoes.push(lastSituacao)

    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/pedidos/1/cliente/cancelar (PUT)', async () => {
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
    mockService.save.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.pedido as any)

    mockService.save(shouldReturn.data.pedido as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
      uid: 'oi',
    } as any)
    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .put('/pedidos/1/cliente/cancelar')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(200)

    const lastSituacao = shouldReturn.data.pedido.situacoes.pop()
    lastSituacao.data = moment(lastSituacao.data)
      .toDate()
      .toJSON()

    shouldReturn.data.pedido.situacoes.push(lastSituacao)

    expect(response.body).toStrictEqual(shouldReturn)
  })
})
