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
import { Usuario } from '../src/models/usuarios/usuario.entity'

describe('PrestadorController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Prestador>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
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

  it('/prestadores/categorias (GET)', async () => {
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
      .get('/prestadores/categorias')
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
    const mockSelect1 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect2 = createMock<SelectQueryBuilder<Prestador>>()
    const mockMany = createMock<SelectQueryBuilder<Prestador>>()
    mockQuery.leftJoinAndSelect.mockReturnValue(mockSelect1)
    mockSelect1.leftJoinAndSelect.mockReturnValue(mockSelect2)
    mockSelect2.where.mockReturnValue(mockMany)
    mockMany.getMany.mockResolvedValue(shouldReturn.data.prestadores)

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

  it('/prestadores/1/informacoes (GET)', async () => {
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
      .get('/prestadores/1/informacoes')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/adicionar_categorias (POST)', async () => {
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

    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)

    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryAtivo = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryLimit = createMock<SelectQueryBuilder<Prestador>>()
    const mockRelation = createMock<RelationQueryBuilder<Categoria>>()
    const mockQueryBuilder = createMock<RelationQueryBuilder<Categoria>>()
    mockQuery.where.mockReturnValue(mockQueryAtivo)
    mockQueryAtivo.limit.mockReturnValue(mockQueryLimit)
    mockRelation.of.mockReturnValue(mockQueryBuilder)
    mockQueryLimit.relation.mockReturnValue(mockRelation)
    mockQueryBuilder.add.mockResolvedValue()

    mockService.createQueryBuilder.mockReturnValue(mockQuery)
    mockService.findOne.mockResolvedValue(shouldReturn.data.prestador)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .post('/prestadores/adicionar_categorias')
      .auth('token-valido', { type: 'bearer' })
      .send({ categorias: [1, 2] })
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/adicionar_servicos (POST)', async () => {
    jest.resetAllMocks()
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

    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [100] },
      uid: 'oi',
    } as any)

    mockService.findOneOrFail.mockResolvedValue(shouldReturn.data.prestador)
    mockService.save.mockResolvedValue(shouldReturn.data.prestador)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1, nome: 'Vinicius' },
    } as any)

    const response = await request(app.getHttpServer())
      .post('/prestadores/adicionar_servicos')
      .auth('token-valido', { type: 'bearer' })
      .send({
        servicos: [
          {
            descricao: 'Esse serviço é novo',
            valor: 256.6,
            nome: 'Novo serviço',
            urlFoto: 'www.fotourl.com.br',
          },
        ],
      })

    shouldReturn.data.prestador.servicos = [
      {
        descricao: 'Esse serviço é novo',
        valor: 256.6,
        nome: 'Novo serviço',
        urlFoto: 'www.fotourl.com.br',
      },
    ]

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/1/adicionar_categorias (POST)', async () => {
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

    mockFirebaseAuth.setCustomUserClaims.mockResolvedValue()
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100] },
      uid: 'oi',
    } as any)

    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryAtivo = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryLimit = createMock<SelectQueryBuilder<Prestador>>()
    const mockRelation = createMock<RelationQueryBuilder<Categoria>>()
    const mockQueryBuilder = createMock<RelationQueryBuilder<Categoria>>()
    mockQuery.where.mockReturnValue(mockQueryAtivo)
    mockQueryAtivo.limit.mockReturnValue(mockQueryLimit)
    mockRelation.of.mockReturnValue(mockQueryBuilder)
    mockQueryLimit.relation.mockReturnValue(mockRelation)
    mockQueryBuilder.add.mockResolvedValue()

    mockService.createQueryBuilder.mockReturnValue(mockQuery)
    mockService.findOne.mockResolvedValue(shouldReturn.data.prestador)

    const response = await request(app.getHttpServer())
      .post('/prestadores/1/adicionar_categorias')
      .auth('token-valido', { type: 'bearer' })
      .send({ categorias: [1, 2] })
    expect(response.status).toBe(201)
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

  it('/prestadores/1/servicos (GET)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: {
          id: 1,
          ativo: true,
          usuario: {
            id: 1,
            ativo: true,
            nome: 'Alice Medeiros',
            nomeSocial: 'Lice',
            dataNascimento: '1999-03-25T03:00:00.000Z',
            telefone: '998047269',
            cpf: '010.677.458-23',
            token: '1I80WG9tuUTIRS3XW8Z6627XYkB2',
            status: 0,
            foto:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/maquiadora.jpg?alt=media&token=0189c4c4-0b85-4f48-931a-2c7ada025700',
          },
          cnpj: '',
          delivery: true,
          documentoUrl:
            'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/Nova-Carteira-de-Identidade_site.jpg?alt=media&token=20e08eb3-ef65-416e-bf4d-32bf3991b650',
          nomePublico: 'Unhas da Alice',
          razaoSocial: '',
          tipoPessoa: 0,
          logo:
            'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/unhas-decoradas-alice-no-pai%CC%81s-das-maravilhas-4.jpg?alt=media&token=4300f2bb-97f5-4aa5-8797-cb8e5ab22a26',
          servicos: [],
        },
      },
    }

    mockService.findOne.mockResolvedValue(shouldReturn.data.prestador as any)
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 200] },
      uid: 'oi',
    } as any)

    const response = await request(app.getHttpServer())
      .get('/prestadores/1/servicos')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/prestadores/eu (GET)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: { nome: 'oi' } as any,
      },
    }
    mockService.findOneOrFail.mockResolvedValue(
      shouldReturn.data.prestador as any,
    )
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { nome: 'Vinicius', id: 1 },
    } as any)

    const response = await request(app.getHttpServer())
      .get('/prestadores/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
