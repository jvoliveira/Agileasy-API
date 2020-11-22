import { Test, TestingModule } from '@nestjs/testing'
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'
import { DisponibilidadesService } from './disponibilidades.service'
import { createMock } from '@golevelup/nestjs-testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DiaSemana } from '../../models/disponibilidades/disponibilidade.interface'

describe('DisponibilidadesService', () => {
  let service: DisponibilidadesService
  const repo = createMock<Repository<Disponibilidade>>()
  const mockConnection = createMock<Connection>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisponibilidadesService,
        {
          provide: getRepositoryToken(Disponibilidade),
          useValue: repo,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile()

    service = module.get<DisponibilidadesService>(DisponibilidadesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should getAllDisponibilidesByPrestador', async () => {
    const shouldReturn = [
      {
        excepcional: false,
        diaSemana: DiaSemana.DOMINGO,
        inicio: '2020-08-14T19:12:13.000Z',
        fim: '2020-08-14T19:12:13.000Z',
      },
    ]
    repo.find.mockResolvedValue([
      {
        excepcional: false,
        diaSemana: DiaSemana.DOMINGO,
        inicio: '2020-08-14T19:12:13.000Z',
        fim: '2020-08-14T19:12:13.000Z',
      } as any,
    ])

    await expect(
      service.getAllDisponibilidesByPrestador(1),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should updateAllDisponibilidade', async () => {
    const shouldReturn = [
      {
        excepcional: false,
        diaSemana: DiaSemana.DOMINGO,
        inicio: '2020-08-14T19:12:13.000Z',
        fim: '2020-08-14T19:12:13.000Z',
      },
    ]

    const mockQueryRunner = createMock<QueryRunner>()
    const mockEntityManager = createMock<EntityManager>()
    mockConnection.createQueryRunner.mockReturnValue(mockQueryRunner)
    mockQueryRunner.connect.mockReturnThis()
    mockQueryRunner.startTransaction.mockReturnThis()
    mockQueryRunner.release.mockReturnThis()
    mockQueryRunner.commitTransaction.mockReturnThis()

    mockEntityManager.save.mockResolvedValue([
      {
        excepcional: false,
        diaSemana: DiaSemana.DOMINGO,
        inicio: '2020-08-14T19:12:13.000Z',
        fim: '2020-08-14T19:12:13.000Z',
      },
    ] as any)

    mockEntityManager.delete.mockReturnThis()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockQueryRunner.manager = mockEntityManager

    await expect(
      service.updateAllDisponibilidade(1, shouldReturn as any),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
