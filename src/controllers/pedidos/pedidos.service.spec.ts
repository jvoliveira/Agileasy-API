import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { PedidosService } from './pedidos.service'
import { createMock } from '@golevelup/nestjs-testing'
import {
  Estado,
  SituacaoInterface,
} from '../../models/situacoes/situacao.interface'
import * as moment from 'moment-timezone'

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

    repo.find.mockResolvedValue(shouldReturn as any)

    await expect(service.getPedidosAsPrestador(1)).resolves.toStrictEqual(
      shouldReturn,
    )
    expect(repo.find).toBeCalledWith({ where: { prestador: { id: 1 } } })
  })

  it('should get pedido as cliente', async () => {
    const shouldReturn = [{ observacao: 'esse pedido é legal' }]

    repo.find.mockResolvedValue(shouldReturn as any)

    await expect(service.getPedidosAsCliente(1)).resolves.toStrictEqual(
      shouldReturn,
    )
    expect(repo.find).toBeCalledWith({ where: { cliente: { id: 1 } } })
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
        'avaliacoes',
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
        'avaliacoes',
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
})
