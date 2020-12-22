import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm'
import { Usuario } from '../src/models/usuarios/usuario.entity'
import { Servico } from '../src/models/servicos/servico.entity'

describe('ServicoController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Servico>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Servico))
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

  it('/servicos/eu (GET)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servicos: [
          {
            id: 2,
            ativo: true,
            apelido: 'Casa',
            servico: 'Rua Euclides Poubel de Lima',
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
    const mockQuery = createMock<SelectQueryBuilder<Servico>>()
    const mockSelect1 = createMock<SelectQueryBuilder<Servico>>()
    const mockSelect2 = createMock<SelectQueryBuilder<Servico>>()
    const mockSelect3 = createMock<SelectQueryBuilder<Servico>>()
    const mockMany = createMock<SelectQueryBuilder<Servico>>()
    mockQuery.leftJoin.mockReturnValue(mockSelect1)
    mockSelect1.leftJoinAndSelect.mockReturnValue(mockSelect2)
    mockSelect2.leftJoinAndSelect.mockReturnValue(mockSelect3)
    mockSelect3.where.mockReturnValue(mockMany)
    mockMany.getMany.mockResolvedValue(shouldReturn.data.servicos as any)

    mockService.createQueryBuilder.mockReturnValue(mockQuery)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1 },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/servicos/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/servicos/adicionar/prestador/eu (POST)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servico: {
          descricao: 'Esse serviço é novo',
          valor: 256.6,
          categorias: [
            {
              id: 1,
            },
          ],
          nome: 'Novo serviço',
          urlFoto: 'www.fotourl.com.br',
          valorFrete: 10,
          tempoMedio: 50,
          noEstabelecimento: false,
          delivery: true,
          prestador: {
            id: 1,
          },
          id: 9,
          ativo: true,
        },
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.servico as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1 },
    } as any)
    mockService.save.mockReturnValue(shouldReturn.data.servico as any)
    const response = await request(app.getHttpServer())
      .post('/servicos/adicionar/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.servico)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/servicos/1/alterar/prestador/eu (PUT)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servico: {
          id: 1,
          ativo: false,
          descricao: 'Esse serviço é novo',
          valor: 256.6,
          nome: 'Novo serviço',
          urlFoto: 'www.fotourl.com.br',
          valorFrete: 10,
          tempoMedio: 50,
          noEstabelecimento: false,
          delivery: true,
          prestador: {
            id: 1,
          },
        },
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.servico as any)
    mockService.findOneOrFail.mockResolvedValue(
      shouldReturn.data.servico as any,
    )
    mockService.findOne.mockResolvedValue(shouldReturn.data.servico as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1 },
    } as any)
    mockService.save.mockResolvedValue(shouldReturn.data.servico as any)
    const response = await request(app.getHttpServer())
      .put('/servicos/1/alterar/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data.servico)
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })
  it('/servicos/1/prestador/eu (DELETE)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servico: {
          id: 1,
          ativo: false,
          descricao: 'Esse serviço é novo',
          valor: 256.6,
          nome: 'Novo serviço',
          urlFoto: 'www.fotourl.com.br',
          valorFrete: 10,
          tempoMedio: 50,
          noEstabelecimento: false,
          delivery: true,
          prestador: {
            id: 1,
          },
        },
      },
    }
    mockService.find.mockResolvedValue(shouldReturn.data.servico as any)
    mockService.findOneOrFail.mockResolvedValue(
      shouldReturn.data.servico as any,
    )

    mockService.findOne.mockResolvedValue(shouldReturn.data.servico as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1 },
    } as any)
    mockService.save.mockResolvedValue(shouldReturn.data.servico as any)
    const response = await request(app.getHttpServer())
      .delete('/servicos/1/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    delete shouldReturn.data.servico
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
