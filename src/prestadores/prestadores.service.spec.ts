import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresService } from './prestadores.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../models/prestadores/prestador.entity'
import { RelationQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Categoria } from '../models/categorias/categoria.entity'

describe('Prestadores Service', () => {
  let service: PrestadoresService
  const repo = createMock<Repository<Prestador>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestadoresService,
        {
          provide: getRepositoryToken(Prestador),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<PrestadoresService>(PrestadoresService)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })

  it('should get prestador by categoria id', async () => {
    const shouldReturn = [{ nome: 'Vinicius' }]
    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryAtivo = createMock<SelectQueryBuilder<Prestador>>()
    const mockRelation = createMock<RelationQueryBuilder<Categoria>>()
    const mockQueryBuilder = createMock<RelationQueryBuilder<Categoria>>()
    mockQuery.where.mockReturnValue(mockQueryAtivo)
    mockRelation.of.mockReturnValue(mockQueryBuilder)
    mockQueryAtivo.relation.mockReturnValue(mockRelation)
    mockQueryBuilder.loadMany.mockResolvedValue(shouldReturn)

    repo.createQueryBuilder.mockReturnValue(mockQuery)

    await expect(service.getPrestadorByCategoria(1)).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(mockQuery.where).toHaveBeenCalledWith({ ativo: true })
    expect(mockRelation.of).toHaveBeenCalledWith(1)
    expect(mockQueryAtivo.relation).toHaveBeenCalledWith(
      Categoria,
      'prestadores',
    )
  })

  it('should add prestador with categoria', async () => {
    const shouldReturn = { nome: 'Vinicius' }
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

    repo.createQueryBuilder.mockReturnValue(mockQuery)

    repo.findOne.mockResolvedValue(shouldReturn as any)

    await expect(service.addCategoria(1, [1, 2, 3, 4])).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(mockQuery.where).toHaveBeenCalledWith({ ativo: true })
    expect(mockRelation.of).toHaveBeenCalledWith(1)
    expect(mockQueryLimit.relation).toHaveBeenCalledWith(
      Prestador,
      'categorias',
    )
  })
})
