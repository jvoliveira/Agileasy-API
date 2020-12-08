import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { CuponsController } from './cupons.controller'
import { CuponsService } from './cupons.service'

describe('CuponsController', () => {
  let controller: CuponsController
  const mockService = createMock<CuponsService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuponsController],
      providers: [
        {
          provide: CuponsService,
          useValue: mockService,
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
      }),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
