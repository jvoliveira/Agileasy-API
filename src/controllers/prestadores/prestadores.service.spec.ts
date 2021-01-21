import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresService } from './prestadores.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../../models/prestadores/prestador.entity'
import { RelationQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Categoria } from '../../models/categorias/categoria.entity'
import { AllException } from '../../common/exceptions/all.exception'
import { TipoStatus } from '../../models/usuarios/usuario.interface'

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

  it('should get servicos by prestador id', async () => {
    const shouldReturn = { nome: 'Vinicius', servicos: [] } as any
    repo.findOne.mockResolvedValue({ nome: 'Vinicius', servicos: [] } as any)

    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect1 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect2 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect3 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect4 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect5 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect6 = createMock<SelectQueryBuilder<Prestador>>()
    const mockMany = createMock<SelectQueryBuilder<Prestador>>()
    mockQuery.leftJoinAndSelect.mockReturnValue(mockSelect1)
    mockSelect1.leftJoinAndSelect.mockReturnValue(mockSelect2)
    mockSelect2.leftJoinAndSelect.mockReturnValue(mockSelect3)
    mockSelect3.leftJoinAndSelect.mockReturnValue(mockSelect4)
    mockSelect4.leftJoinAndSelect.mockReturnValue(mockSelect5)
    mockSelect5.leftJoinAndSelect.mockReturnValue(mockSelect6)
    mockSelect6.where.mockReturnValue(mockMany)
    mockMany.getOne.mockResolvedValue(shouldReturn)

    repo.createQueryBuilder.mockReturnValue(mockQuery)

    await expect(service.getServicosByPrestador(1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })

  it('should get prestador by categoria id', async () => {
    const shouldReturn = [{ nome: 'Vinicius' }] as any
    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect1 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect2 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect3 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect4 = createMock<SelectQueryBuilder<Prestador>>()
    const mockSelect5 = createMock<SelectQueryBuilder<Prestador>>()
    const mockMany = createMock<SelectQueryBuilder<Prestador>>()
    mockQuery.leftJoinAndSelect.mockReturnValue(mockSelect1)
    mockSelect1.leftJoinAndSelect.mockReturnValue(mockSelect2)
    mockSelect2.leftJoinAndSelect.mockReturnValue(mockSelect3)
    mockSelect3.leftJoinAndSelect.mockReturnValue(mockSelect4)
    mockSelect4.leftJoinAndSelect.mockReturnValue(mockSelect5)
    mockSelect5.where.mockReturnValue(mockMany)
    mockMany.getMany.mockResolvedValue(shouldReturn)

    repo.createQueryBuilder.mockReturnValue(mockQuery)

    await expect(service.getPrestadorByCategoria(1)).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(
      mockSelect5.where,
    ).toHaveBeenCalledWith(
      'prestador.ativo = TRUE and c.id = :idCategoria and prestador.ativo = true and s.ativo = true and c.ativo = true and u.status = ' +
        TipoStatus.ativo,
      { idCategoria: 1 },
    )
    expect(mockQuery.leftJoinAndSelect).toHaveBeenCalledWith(
      'prestador.categorias',
      'c',
    )
    expect(mockSelect1.leftJoinAndSelect).toHaveBeenCalledWith(
      'prestador.servicos',
      's',
    )
  })

  it('should add prestador with categoria', async () => {
    const shouldReturn = { nome: 'Vinicius', categorias: [] }
    const mockQuery = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryAtivo = createMock<SelectQueryBuilder<Prestador>>()
    const mockQueryLimit = createMock<SelectQueryBuilder<Prestador>>()
    const mockRelation = createMock<RelationQueryBuilder<Categoria>>()
    const mockQueryBuilder = createMock<RelationQueryBuilder<Categoria>>()
    mockQuery.where.mockReturnValue(mockQueryAtivo)
    mockQueryAtivo.limit.mockReturnValue(mockQueryLimit)
    mockRelation.of.mockReturnValue(mockQueryBuilder)
    mockQueryLimit.relation.mockReturnValue(mockRelation)
    mockQueryBuilder.addAndRemove.mockResolvedValue()

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

  it('should add prestador with servicos', async () => {
    const shouldReturn = { nome: 'Vinicius', servicos: [] }
    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    repo.save.mockResolvedValue(shouldReturn as any)

    await expect(
      service.addServicos(1, [
        {
          descricao: 'Serviço interessante',
        } as any,
      ]),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should add prestador with disponibilidades', async () => {
    const shouldReturn = { nome: 'Vinicius', disponibilidades: [] }
    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    repo.save.mockResolvedValue(shouldReturn as any)

    await expect(
      service.addDisponibilidades(1, [
        {
          diaSemana: 0,
        } as any,
      ]),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should be get prestador with categoria', async () => {
    const shouldReturn = [
      {
        nome: 'Vinicius Picanco',
      },
    ]

    expect(service).toBeDefined()

    repo.find.mockReturnValue(shouldReturn as any)

    expect(await service.getPrestadoresWithCategoria()).toBe(shouldReturn)
    expect(repo.find).toHaveBeenCalledWith({
      where: { ativo: true },
      relations: ['categorias', 'endereco', 'disponibilidades'],
    })

    repo.find.mockClear()
    repo.find.mockReturnValue(null)

    await expect(service.getPrestadoresWithCategoria()).rejects.toThrow(
      AllException,
    )
  })

  it('should be get all information', async () => {
    const shouldReturn = {
      descricao: 'Vinicius Picanco',
      servicos: [],
    }

    expect(service).toBeDefined()

    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    expect(await service.getAllInformation(1)).toBe(shouldReturn)
    expect(repo.findOneOrFail).toHaveBeenCalledWith(1, {
      relations: ['usuario', 'endereco', 'pedidos', 'servicos', 'categorias'],
    })

    repo.findOneOrFail.mockClear()
    repo.findOneOrFail.mockRejectedValue(new Error())

    await expect(service.getAllInformation(1)).rejects.toThrow(Error)
  })

  it('should be get all information without pedidos', async () => {
    const shouldReturn = [
      {
        descricao: 'Vinicius Picanco',
      },
    ]

    expect(service).toBeDefined()

    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    expect(await service.getAllInformationWithoutPedidos(1)).toBe(shouldReturn)
    expect(repo.findOneOrFail).toHaveBeenCalledWith(1, {
      relations: [
        'usuario',
        'endereco',
        'servicos',
        'categorias',
        'disponibilidades',
      ],
    })

    repo.findOneOrFail.mockClear()
    repo.findOneOrFail.mockRejectedValue(new Error())

    await expect(service.getAllInformationWithoutPedidos(1)).rejects.toThrow(
      Error,
    )
  })
})
