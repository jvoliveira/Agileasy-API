import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from '../src/models/usuarios/usuario.entity'
import { MetodoPagamento } from '../src/models/metodos-pagamento/metodo-pagamento.entity'

describe('MetodoPagamentoController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<MetodoPagamento>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(MetodoPagamento))
      .useValue(mockService)
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue(mockUsuarioRepo)
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

  it('/metodos-pagamento/comuns (GET)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        enderecos: [
          {
            id: 1,
            ativo: true,
            tipoPagamento: 0,
          },
          {
            id: 2,
            ativo: true,
            tipoPagamento: 1,
          },
          {
            id: 3,
            ativo: true,
            tipoPagamento: 2,
          },
          {
            id: 4,
            ativo: true,
            tipoPagamento: 3,
          },
          {
            id: 5,
            ativo: true,
            tipoPagamento: 4,
          },
        ],
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.enderecos as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1 },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/metodos-pagamento/comuns')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
