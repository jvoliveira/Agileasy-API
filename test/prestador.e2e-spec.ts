import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Prestador } from '../src/models/prestadores/prestador.entity'
import { RelationQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm'
import { TipoErro } from '../src/common/enums/tipo-erro.enum'
import { Categoria } from '../src/models/categorias/categoria.entity'

describe('PrestadorController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Prestador>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Prestador))
      .useValue(mockService)
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

  it('/prestadores (GET)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores: [{ nome: 'oi' } as any],
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.prestadores)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/prestadores')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/:id/categoria (GET)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores: [{ nome: 'oi' } as any],
      },
    }
    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryAtivo = createMock<SelectQueryBuilder<Prestador>>()
    const mockRelation = createMock<RelationQueryBuilder<Categoria>>()
    const mockQueryBuilder = createMock<RelationQueryBuilder<Categoria>>()
    mockQuery.where.mockReturnValue(mockQueryAtivo)
    mockRelation.of.mockReturnValue(mockQueryBuilder)
    mockQueryAtivo.relation.mockReturnValue(mockRelation)
    mockQueryBuilder.loadMany.mockResolvedValue(shouldReturn.data.prestadores)
    mockService.createQueryBuilder.mockReturnValue(mockQuery)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/prestadores/1/categoria')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/1 (GET)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: { nome: 'oi' } as any,
      },
    }
    mockService.findOne.mockResolvedValue(shouldReturn.data.prestador)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/prestadores/1')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/criar (POST)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: {
          usuario: {
            status: 0,
            nome: 'João Oliveira',
            dataNascimento: '2020-09-10T18:51:22.931Z',
            telefone: '22999496547',
            cpf: '14582486722',
          },
          cnpj: '30419000166',
          delivery: true,
          documentoUrl: 'http://storage.google.com',
          nomePublico: 'OLIVEIRA TECH',
          razaoSocial: 'Oliveira prestação de serviços',
          tipoPessoa: 1,
          endereco: {
            apelido: 'Casa',
            endereco: 'Rua Alvaro Tinoco Lanes',
            complemento: 'Baixos',
            numero: '105',
            cidade: 'Itaperuna',
            estado: 'RJ',
            cep: '28300000',
            referencia: null,
          },
        } as any,
      },
    }
    mockService.save.mockResolvedValue(shouldReturn.data.prestador)
    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
      uid: 'oi',
    } as any)

    const response = await request(app.getHttpServer())
      .post('/prestadores/criar')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.prestador)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
