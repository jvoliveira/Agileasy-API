import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Servico } from '../../models/servicos/servico.entity'
import { ServicosService } from './servicos.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Repository, SelectQueryBuilder } from 'typeorm'

describe('ServicosService', () => {
  let service: ServicosService
  const repo = createMock<Repository<Servico>>()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        {
          provide: getRepositoryToken(Servico),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<ServicosService>(ServicosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be get servicos with prestador', async () => {
    const shouldReturn = [
      {
        descricao: 'Vinicius Picanco',
      },
    ]

    expect(service).toBeDefined()

    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    expect(await service.getByIdWithPrestador(1)).toBe(shouldReturn)
    expect(repo.findOneOrFail).toHaveBeenCalledWith(1, {
      relations: ['prestador'],
    })

    repo.findOneOrFail.mockClear()
    repo.findOneOrFail.mockRejectedValue(new Error())

    await expect(service.getByIdWithPrestador(1)).rejects.toThrow(Error)
  })

  it('should list enderecos from cliente', async () => {
    const shouldReturn = [{ descricao: 'Vinicius' }]

    const mockQuery = createMock<SelectQueryBuilder<Servico>>()
    const mockSelect1 = createMock<SelectQueryBuilder<Servico>>()
    const mockSelect2 = createMock<SelectQueryBuilder<Servico>>()
    const mockSelect3 = createMock<SelectQueryBuilder<Servico>>()
    const mockMany = createMock<SelectQueryBuilder<Servico>>()
    mockQuery.leftJoin.mockReturnValue(mockSelect1)
    mockSelect1.leftJoinAndSelect.mockReturnValue(mockSelect2)
    mockSelect2.leftJoinAndSelect.mockReturnValue(mockSelect3)
    mockSelect3.where.mockReturnValue(mockMany)
    mockMany.getMany.mockResolvedValue(shouldReturn as any)

    repo.createQueryBuilder.mockReturnValue(mockQuery)

    await expect(service.getServicoByPrestador(1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })
})
