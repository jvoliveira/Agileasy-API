import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../common/services/user.service'
import { PedidosService } from '../pedidos/pedidos.service'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'

describe('ChatsController', () => {
  let controller: ChatsController
  const service = createMock<ChatsService>()
  const mockUser = createMock<UserService>()
  const mockPedido = createMock<PedidosService>()
  const mockFirebaseMessaging = createMock<FirebaseMessagingService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [
        {
          provide: ChatsService,
          useValue: service,
        },
        {
          provide: UserService,
          useValue: mockUser,
        },
        {
          provide: PedidosService,
          useValue: mockPedido,
        },
        {
          provide: FirebaseMessagingService,
          useValue: mockFirebaseMessaging,
        },
      ],
    }).compile()

    controller = module.get<ChatsController>(ChatsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
