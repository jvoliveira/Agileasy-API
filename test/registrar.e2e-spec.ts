import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Prestador } from '../src/models/prestadores/prestador.entity'
import { Repository } from 'typeorm'
import { TipoErro } from '../src/common/enums/tipo-erro.enum'

describe('PrestadorController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Prestador>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
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

  it('/registrar/parceiro (POST)', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: {
          email: 'vimivini@gmail.com',
          senha:
            'e54ee7e285fbb0275279143abc4c554e5314e7b417ecac83a5984a964facbaad68866a2841c3e83ddf125a2985566261c4014f9f960ec60253aebcda9513a9b4',
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
    mockFirebaseAuth.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)

    const response = await request(app.getHttpServer())
      .post('/registrar/prestador')
      .send(shouldReturn.data.prestador)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
    expect(mockFirebaseAuth.verifyIdToken).toBeCalledTimes(0)
  })
})
