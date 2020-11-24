import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { ChatsService } from './chats.service'

describe('ChatsService', () => {
  let service: ChatsService
  const mockFirebase = createMock<FirebaseFirestoreService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: FirebaseFirestoreService,
          useValue: mockFirebase,
        },
      ],
    }).compile()

    service = module.get<ChatsService>(ChatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
