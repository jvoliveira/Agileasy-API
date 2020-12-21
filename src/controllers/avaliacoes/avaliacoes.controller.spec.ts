import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { UserService } from '../../common/services/user.service'
import { Avaliacao } from '../../models/avaliacao/avaliacao.entity'
import { PedidosService } from '../pedidos/pedidos.service'
import { AvaliacoesController } from './avaliacoes.controller'
import { AvaliacoesService } from './avaliacoes.service'

describe('AvaliacoesController', () => {
  let controller: AvaliacoesController
  const service = createMock<AvaliacoesService>()
  const userService = createMock<UserService>()
  const pedidoService = createMock<PedidosService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacoesController],
      providers: [
        {
          provide: AvaliacoesService,
          useValue: service,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: PedidosService,
          useValue: pedidoService,
        },
      ],
    }).compile()

    controller = module.get<AvaliacoesController>(AvaliacoesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('shoud add a new avaliacao and return it', async () => {
    const mockUser = { uid: 1 }
    const mockDto = {
      ativo: true,
      comentario: 'comenario teste',
      nota: 5,
      urlFoto: null,
      quemAvaliou: 1,
    }

    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    pedidoService.getByIdAsCliente.mockResolvedValue({ id: 1 } as any)
    service.create.mockResolvedValue({
      id: 1,
      ativo: true,
      comentario: 'comenario teste',
      nota: 5,
      urlFoto: null,
      quemAvaliou: 1,
      pedido: { id: 1 },
    } as any)

    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        avaliacao: {
          ativo: true,
          comentario: 'comenario teste',
          nota: 5,
          urlFoto: null,
          quemAvaliou: 1,
          pedido: {
            id: 1,
          },
          id: 1,
        },
      },
    }

    await expect(
      controller.novaAvaliacao(mockUser as any, mockDto as any, 1),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
