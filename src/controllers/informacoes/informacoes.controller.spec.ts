import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../common/services/user.service'
import { InformacoesController } from './informacoes.controller'
import { InformacoesService } from './informacoes.service'

describe('InformacoesController', () => {
  let controller: InformacoesController
  const service = createMock<InformacoesService>()
  const userService = createMock<UserService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformacoesController],
      providers: [
        {
          provide: InformacoesService,
          useValue: service,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile()

    controller = module.get<InformacoesController>(InformacoesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create informacao', () => {
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
  })
})
