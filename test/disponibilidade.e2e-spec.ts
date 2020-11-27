import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { AppModule } from '../src/app.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm'
import { Usuario } from '../src/models/usuarios/usuario.entity'
import { Disponibilidade } from '../src/models/disponibilidades/disponibilidade.entity'
import { DiaSemana } from '../src/models/disponibilidades/disponibilidade.interface'

describe('DisponibilidadeController (e2e)', () => {
  let app: INestApplication
  const mockService = createMock<Repository<Disponibilidade>>()
  const mockUsuarioRepo = createMock<Repository<Usuario>>()
  const mockFirebaseAuth = createMock<FirebaseAuthenticationService>()

  beforeAll(async () => {
    jest.resetAllMocks()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseAuthenticationService)
      .useValue(mockFirebaseAuth)
      .overrideProvider(getRepositoryToken(Disponibilidade))
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

  it('/disponibilidades/prestador/eu (GET)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        disponibilidades: [
          {
            id: 2,
            excepcional: false,
            diaSemana: 1,
            inicio: '2020-08-14T09:12:13.000Z',
            fim: '2020-08-14T11:12:13.000Z',
          },
        ],
      },
    }
    mockService.find.mockResolvedValue(
      shouldReturn.data.disponibilidades as any,
    )
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
      .get('/disponibilidades/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(shouldReturn)
  })

  it('/disponibilidades/adicionar/cliente/eu (POST)', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        disponibilidades: [
          {
            excepcional: false,
            diaSemana: DiaSemana.DOMINGO,
            inicio: '2020-08-14T09:12:13.000Z',
            fim: '2020-08-14T11:12:13.000Z',
            prestador: {
              id: 1,
            },
          },
        ],
      },
    }

    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)
    mockFirebaseAuth.getUser.mockResolvedValue({
      customClaims: { roles: [0, 100, 200] },
    } as any)

    mockUsuarioRepo.findOne.mockReturnValue({
      prestador: { id: 1 },
    } as any)
    const masterEntityManager = createMock<EntityManager>()
    const masterConnection = createMock<Connection>()
    const mockQueryRunner = createMock<QueryRunner>()
    const mockEntityManager = createMock<EntityManager>()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockService.manager = masterEntityManager
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    masterEntityManager.connection = masterConnection
    masterConnection.createQueryRunner.mockReturnValue(mockQueryRunner)

    mockQueryRunner.connect.mockReturnThis()
    mockQueryRunner.startTransaction.mockReturnThis()
    mockQueryRunner.release.mockReturnThis()
    mockQueryRunner.commitTransaction.mockReturnThis()

    mockEntityManager.save.mockReturnValue(
      shouldReturn.data.disponibilidades as any,
    )

    mockEntityManager.delete.mockReturnThis()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockQueryRunner.manager = mockEntityManager
    const response = await request(app.getHttpServer())
      .post('/disponibilidades/adicionar/prestador/eu')
      .auth('token-valido', { type: 'bearer' })
      .send(shouldReturn.data)
    expect(response.status).toBe(201)
    delete response.body.data.disponibilidades[0].id
    expect(response.body).toStrictEqual(shouldReturn)
  })
})
