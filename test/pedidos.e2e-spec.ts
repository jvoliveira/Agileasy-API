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

describe('PedidoController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Pedido>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockServicosRepo = createMock<Repository<Servico>>()
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
          metodoPagamento: {
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
    mockServicosRepo.findOne.mockResolvedValue({ valor: 25, id: 1 } as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
      uid: 'oi',
    } as any)

    const response = await request(app.getHttpServer())
      .post('/pedidos/novo')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.pedido)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
