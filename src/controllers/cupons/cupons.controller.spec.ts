import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../common/services/user.service'
import { PedidosService } from '../pedidos/pedidos.service'
import { CuponsController } from './cupons.controller'
import { CuponsService } from './cupons.service'

describe('CuponsController', () => {
  let controller: CuponsController
  const mockService = createMock<CuponsService>()
  const mockPedidoService = createMock<PedidosService>()
  const mockUserService = createMock<UserService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuponsController],
      providers: [
        {
          provide: CuponsService,
          useValue: mockService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PedidosService,
          useValue: mockPedidoService,
        },
      ],
    }).compile()

    controller = module.get<CuponsController>(CuponsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create new cupom', async () => {
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
    mockService.create.mockResolvedValue(shouldReturn.data.cupom as any)
    await expect(
      controller.createNewCupom({
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
      }),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should validate cupom', async () => {
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
          validade: '2020-12-29T05:00:00.000Z',
          quantidadeMaxima: 1,
          restantes: 1,
        },
      },
    }
    mockUserService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    mockService.validateCupomNormal.mockResolvedValue(
      shouldReturn.data.cupom as any,
    )
    mockPedidoService.hasUsedCupomByCliente.mockReturnThis()
    const userRecord = { uid: 'uid-valido' }

    await expect(
      controller.validateCupomNormal(userRecord as any, '#ITAPERUNA'),
    ).resolves.toStrictEqual(shouldReturn)

    expect(mockUserService.getClienteByToken).toBeCalledWith('uid-valido')
    expect(mockService.validateCupomNormal).toBeCalledWith('#ITAPERUNA')
    expect(mockPedidoService.hasUsedCupomByCliente).toBeCalledWith(1, 1)
  })
})
