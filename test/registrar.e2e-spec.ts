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
import { Cliente } from '../src/models/clientes/cliente.entity'

describe('PrestadorController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Prestador>>()
  const mockClienteService = createMock<Repository<Cliente>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Prestador))
      .useValue(mockService)
      .overrideProvider(getRepositoryToken(Cliente))
      .useValue(mockClienteService)
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
            bairro: 'São Mateus',
            estado: 'RJ',
            cep: '28300000',
            referencia: null,
          },
        } as any,
      },
    }
    mockService.save.mockResolvedValue(shouldReturn.data.prestador)
    mockFirebaseAuth.setCustomUserClaims.mockReturnThis()
    mockFirebaseAuth.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)

    const response = await request(app.getHttpServer())
      .post('/registrar/prestador')
      .send(shouldReturn.data.prestador)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
    expect(mockFirebaseAuth.verifyIdToken).toBeCalledTimes(0)
  })

  it('/registrar/cliente (POST)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente: {
          email: 'cliente-teste@gmail.com',
          senha:
            'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413',
          usuario: {
            status: 0,
            nome: 'Yollanda Figueira',
            dataNascimento: '1999-09-10T18:51:22.931Z',
            telefone: '22999496547',
            cpf: '14582486722',
            token: 'M00KRUFSbaaKacGnhNACRpls9tr1',
            nomeSocial: null,
            foto: null,
            id: 6,
            ativo: true,
          },
          endereco: {
            apelido: 'Casa',
            endereco: 'Rua Alvaro Tinoco Lanes',
            complemento: 'Baixos',
            numero: '105',
            cidade: 'Itaperuna',
            estado: 'RJ',
            bairro: 'São Mateus',
            cep: '28300000',
            referencia: null,
          },
          id: 2,
          ativo: true,
        },
      },
    }
    mockClienteService.save.mockResolvedValue(shouldReturn.data.cliente as any)
    mockFirebaseAuth.setCustomUserClaims.mockReturnThis()
    mockFirebaseAuth.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)

    const response = await request(app.getHttpServer())
      .post('/registrar/cliente')
      .send(shouldReturn.data.cliente)
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
    expect(mockFirebaseAuth.verifyIdToken).toBeCalledTimes(0)
  })
})
