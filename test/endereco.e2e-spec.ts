import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from '../src/models/usuarios/usuario.entity'
import { Endereco } from '../src/models/enderecos/endereco.entity'

describe('EnderecoController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Endereco>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Endereco))
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

  it('/enderecos/eu (GET)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        enderecos: [
          {
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
      .get('/enderecos/cliente/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/enderecos/adicionar/cliente/eu (POST)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco: {
          apelido: 'Casa',
          endereco: 'Rua Benedito Nicolau',
          complemento: 'interfone 30',
          numero: '123',
          cidade: 'Itaperuna',
          estado: 'RJ',
          cep: '28300-000',
        },
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.endereco as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1 },
    } as any)
    mockService.save.mockReturnValue(shouldReturn.data.endereco as any)
    const response = await request(app.getHttpServer())
      .post('/enderecos/adicionar/cliente/eu')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.endereco)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/enderecos/1/alterar/cliente/eu (PUT)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco: {
          apelido: 'Casa',
          endereco: 'Rua Benedito Nicolau',
          complemento: 'interfone 30',
          numero: '123',
          cidade: 'Itaperuna',
          estado: 'RJ',
          cep: '28300-000',
          cliente: {
            id: 1,
          },
        },
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.endereco as any)
    mockService.findOneOrFail.mockResolvedValue(
      shouldReturn.data.endereco as any,
    )
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1 },
    } as any)
    mockService.update.mockResolvedValue({ affected: 1 } as any)
    const response = await request(app.getHttpServer())
      .put('/enderecos/1/alterar/cliente/eu')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.endereco)
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/enderecos/1/cliente/eu (PUT)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco: {
          apelido: 'Casa',
          endereco: 'Rua Benedito Nicolau',
          complemento: 'interfone 30',
          numero: '123',
          cidade: 'Itaperuna',
          estado: 'RJ',
          cep: '28300-000',
          cliente: {
            id: 1,
          },
        },
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.endereco as any)
    mockService.findOneOrFail.mockResolvedValue(
      shouldReturn.data.endereco as any,
    )

    mockService.findOne.mockResolvedValue(shouldReturn.data.endereco as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      cliente: { id: 1 },
    } as any)
    mockService.save.mockResolvedValue(shouldReturn.data.endereco as any)
    const response = await request(app.getHttpServer())
      .delete('/enderecos/1/cliente/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    delete shouldReturn.data.endereco
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
