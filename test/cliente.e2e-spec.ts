import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../src/common/enums/tipo-erro.enum'
import { Usuario } from '../src/models/usuarios/usuario.entity'
import { Cliente } from '../src/models/clientes/cliente.entity'

describe('ClienteController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Cliente>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Cliente))
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

  it('/clientes/eu (GET)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente: [{ nome: 'oi' } as any],
      },
    }
    mockService.findOneOrFail.mockResolvedValue(
      shouldReturn.data.cliente as any,
    )
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { nome: 'Vinicius', id: 1 },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/clientes/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/clientes/atualizar/notificacao/eu (PUT)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
    mockUsuarioRepo.update.mockResolvedValue({ affected: 1 } as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { nome: 'Vinicius', id: 1, usuario: { id: 1 } },
    } as any)

    mockUsuarioRepo.findOneOrFail.mockResolvedValue({ id: 1 } as any)

    const response = await request(app.getHttpServer())
      .put('/clientes/atualizar/notificacao/eu')
      .auth('token-valido', { type: 'bearer' })
      .send({ tokenNotificacao: 'TESTE' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
