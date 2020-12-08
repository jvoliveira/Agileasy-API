import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { Repository } from 'typeorm'
import { Cupom } from '../src/models/cupons/cupom.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { TipoUsuario } from '../src/common/enums/tipo-usuario.enum'

describe('CuponsController (e2e)', () => {
  let app: INestApplication
  const mockRepo = createMock<Repository<Cupom>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Cupom))
      .useValue(mockRepo)
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
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

  it('/cupons/novo (POST)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        cupom: {
          id: 1,
          indicacao: false,
          codigo: '#ITAPERUNA',
          desconto: 10,
          valorMinimo: 2,
          tipoCupom: 0,
          voucher: 0,
          tipoDesconto: 1,
          validade: '2020-12-29T03:00:00Z',
          ativo: true,
        },
      },
    }

    mockRepo.save.mockResolvedValue(shouldReturn.data.cupom as any)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [TipoUsuario.ADMIN] },
    } as any)

    const response = await request(app.getHttpServer())
      .post('/cupons/novo')
      .send({
        indicacao: false,
        codigo: '#ITAPERUNA',
        desconto: 10,
        valorMinimo: 2,
        tipoCupom: 0,
        voucher: 0,
        tipoDesconto: 1,
        validade: '2020-12-29T00:00:00-03:00',
        ativo: true,
      })
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
