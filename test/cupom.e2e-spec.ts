import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { Cupom } from '../src/models/cupons/cupom.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { TipoUsuario } from '../src/common/enums/tipo-usuario.enum'
import { Pedido } from '../src/models/pedidos/pedido.entity'
import { Usuario } from '../src/models/usuarios/usuario.entity'

describe('CuponsController (e2e)', () => {
  let app: INestApplication
  const mockRepo = createMock<Repository<Cupom>>()
  const mockPedido = createMock<Repository<Pedido>>()
  const mockUsuario = createMock<Repository<Usuario>>()
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
      .overrideProvider(getRepositoryToken(Pedido))
      .useValue(mockPedido)
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue(mockUsuario)
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
          restantes: 1,
          quantidadeMaxima: 1,
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
        restantes: 1,
        quantidadeMaxima: 1,
      })
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/cupons/:codigo/validar/cliente/eu (PATCH)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        cupom: {
          id: 1,
          ativo: true,
          indicacao: false,
          codigo: '#ITAPERUNA',
          desconto: 10,
          valorMinimo: 2,
          tipoCupom: 0,
          tipoDesconto: 1,
          voucher: 0,
          validade: '2100-12-29T05:00:00.000Z',
          quantidadeMaxima: 1,
          restantes: 1,
        },
      },
    }

    mockRepo.find.mockResolvedValue([shouldReturn.data.cupom] as any)
    mockUsuario.findOne.mockResolvedValue({ cliente: { id: 1 } } as any)

    const mockQueryBuilder = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect1 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect2 = createMock<SelectQueryBuilder<Pedido>>()
    const mockWhere = createMock<SelectQueryBuilder<Pedido>>()

    mockPedido.createQueryBuilder.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.leftJoinAndSelect.mockReturnValue(mockLeftJoinAndSelect1)
    mockLeftJoinAndSelect1.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect2,
    )
    mockLeftJoinAndSelect2.where.mockReturnValue(mockWhere)
    mockWhere.getCount.mockResolvedValue(0)

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [TipoUsuario.CLIENTE] },
    } as any)

    const response = await request(app.getHttpServer())
      .patch('/cupons/%23ITAPERUNA/validar/cliente/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
