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
})
