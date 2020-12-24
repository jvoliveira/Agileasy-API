import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { PedidosService } from './pedidos.service'
import { createMock } from '@golevelup/nestjs-testing'
import {
  Estado,
  SituacaoInterface,
} from '../../models/situacoes/situacao.interface'
import * as moment from 'moment-timezone'
import { AllException } from '../../common/exceptions/all.exception'

describe('PedidosService', () => {
  let service: PedidosService
  const repo = createMock<Repository<Pedido>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(Pedido),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<PedidosService>(PedidosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get pedido as prestador', async () => {
    const shouldReturn = [{ observacao: 'esse pedido é legal' }]

    const mockQueryBuilder = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect1 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoin1 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect2 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect3 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect4 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect5 = createMock<SelectQueryBuilder<Pedido>>()
    const mockWhere = createMock<SelectQueryBuilder<Pedido>>()
    const mockOrder = createMock<SelectQueryBuilder<Pedido>>()

    repo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.leftJoinAndSelect.mockReturnValue(mockLeftJoinAndSelect1)
    mockLeftJoinAndSelect1.leftJoin.mockReturnValue(mockLeftJoin1)
    mockLeftJoin1.leftJoinAndSelect.mockReturnValue(mockLeftJoinAndSelect2)
    mockLeftJoinAndSelect2.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect3,
    )
    mockLeftJoinAndSelect3.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect4,
    )
    mockLeftJoinAndSelect4.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect5,
    )
    mockLeftJoinAndSelect5.where.mockReturnValue(mockWhere)
    mockWhere.orderBy.mockReturnValue(mockOrder)
    mockOrder.getMany.mockResolvedValue(shouldReturn as any)

    await expect(service.getPedidosAsPrestador(1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })

  it('should get pedido as cliente', async () => {
    const shouldReturn = [{ observacao: 'esse pedido é legal' }]

    const mockQueryBuilder = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect1 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoin1 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect2 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect3 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect4 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect5 = createMock<SelectQueryBuilder<Pedido>>()
    const mockWhere = createMock<SelectQueryBuilder<Pedido>>()
    const mockOrder = createMock<SelectQueryBuilder<Pedido>>()

    repo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.leftJoinAndSelect.mockReturnValue(mockLeftJoinAndSelect1)
    mockLeftJoinAndSelect1.leftJoin.mockReturnValue(mockLeftJoin1)
    mockLeftJoin1.leftJoinAndSelect.mockReturnValue(mockLeftJoinAndSelect2)
    mockLeftJoinAndSelect2.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect3,
    )
    mockLeftJoinAndSelect3.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect4,
    )
    mockLeftJoinAndSelect4.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect5,
    )
    mockLeftJoinAndSelect5.where.mockReturnValue(mockWhere)
    mockWhere.orderBy.mockReturnValue(mockOrder)
    mockOrder.getMany.mockResolvedValue(shouldReturn as any)

    await expect(service.getPedidosAsCliente(1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })

  it('should get pedido as prestador', async () => {
    const shouldReturn = { observacao: 'esse pedido é legal' }

    repo.findOneOrFail.mockResolvedValue(shouldReturn as any)

    await expect(service.getByIdAsPrestador(1, 1, true)).resolves.toStrictEqual(
      shouldReturn,
    )
    expect(repo.findOneOrFail).toBeCalledWith({
      relations: [
        'metodoPagamento',
        'cliente',
        'prestador',
        'situacoes',
        'endereco',
        'servicos',
        'avaliacao',
        'folhasRespostas',
      ],
      where: { id: 1, prestador: { id: 1 } },
    })
  })

  it('should get pedido and cliente by id', async () => {
    const shouldReturn = { observacao: 'esse pedido é legal' }

    repo.findOneOrFail.mockResolvedValue(shouldReturn as any)

    await expect(service.getByIdAsCliente(1, 1, true)).resolves.toStrictEqual(
      shouldReturn,
    )
    expect(repo.findOneOrFail).toBeCalledWith({
      relations: [
        'metodoPagamento',
        'cliente',
        'prestador',
        'situacoes',
        'endereco',
        'servicos',
        'avaliacao',
        'folhasRespostas',
      ],
      where: { id: 1, cliente: { id: 1 } },
    })
  })

  it('should change situacao to ACEITO', async () => {
    const shouldReturn = { observacao: 'esse pedido é legal', situacoes: [] }

    repo.save.mockResolvedValue(shouldReturn as any)

    const situacao: SituacaoInterface = {
      data: moment().toDate(),
      estado: Estado.aceito,
    }

    shouldReturn.situacoes.push(situacao)

    await expect(
      service.changeSituacao({ situacoes: [] } as any, situacao),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should check pedido and cliente', async () => {
    const mockQueryBuilder = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect1 = createMock<SelectQueryBuilder<Pedido>>()
    const mockLeftJoinAndSelect2 = createMock<SelectQueryBuilder<Pedido>>()
    const mockWhere = createMock<SelectQueryBuilder<Pedido>>()

    repo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.leftJoinAndSelect.mockReturnValue(mockLeftJoinAndSelect1)
    mockLeftJoinAndSelect1.leftJoinAndSelect.mockReturnValue(
      mockLeftJoinAndSelect2,
    )
    mockLeftJoinAndSelect2.where.mockReturnValue(mockWhere)
    mockWhere.getCount.mockResolvedValue(1)

    await expect(service.hasUsedCupomByCliente(1, 1)).rejects.toThrow(
      AllException,
    )
  })
})
