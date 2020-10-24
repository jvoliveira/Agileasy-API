import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pedido } from '../models/pedidos/pedido.entity'
import { PedidosService } from './pedidos.service'
import { createMock } from '@golevelup/nestjs-testing'

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
})
