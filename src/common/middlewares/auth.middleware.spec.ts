import { Test, TestingModule } from '@nestjs/testing'

import { AuthMiddleware } from './auth.middleware'
import { createMock } from '@golevelup/nestjs-testing'
import { RequestAuth } from '../interfaces/request-auth.interface'
import { Response } from 'express'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { AppConfigService } from '../../config/app/config.service'

describe('Testing auth middleware', () => {
  let service: AuthMiddleware
  let mockRequest = createMock<RequestAuth>() as any
  let mockResponse = createMock<Response>()
  let mockNext = jest.fn()
  let mockFirebaseAuth = createMock<FirebaseAuthenticationService>()
  let mockAppConfig = createMock<AppConfigService>() as any

  beforeEach(async () => {
    jest.clearAllMocks()
    mockRequest = createMock<RequestAuth>() as any
    mockResponse = createMock<Response>()
    mockNext = jest.fn()
    mockFirebaseAuth = createMock<FirebaseAuthenticationService>()
    mockAppConfig = createMock<AppConfigService>() as any
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        { useValue: mockFirebaseAuth, provide: FirebaseAuthenticationService },
        { useValue: mockAppConfig, provide: AppConfigService },
      ],
    }).compile()
    service = module.get<AuthMiddleware>(AuthMiddleware)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should call with verify google - test', async () => {
    mockAppConfig.env = 'test'
    mockRequest.headers = { authorization: 'Bearer token-valido' }
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)

    mockFirebaseAuth.getUser.mockReturnThis()

    await service.use(mockRequest, mockResponse, mockNext)

    expect(mockFirebaseAuth.getUser).toBeCalledTimes(1)
    expect(mockFirebaseAuth.getUser).toHaveBeenCalledWith('uid-valido')
    expect(mockFirebaseAuth.verifyIdToken).toBeCalledTimes(1)
    expect(mockFirebaseAuth.verifyIdToken).toHaveBeenCalledWith('token-valido')
  })

  it('should call with verify google - development', async () => {
    mockAppConfig.env = 'development'
    mockRequest.headers = { authorization: 'Bearer token-valido' }
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)

    mockFirebaseAuth.getUser.mockReturnThis()

    await service.use(mockRequest, mockResponse, mockNext)

    expect(mockFirebaseAuth.getUser).toBeCalledTimes(1)
    expect(mockFirebaseAuth.getUser).toHaveBeenCalledWith('uid-valido')
    expect(mockFirebaseAuth.verifyIdToken).toBeCalledTimes(1)
    expect(mockFirebaseAuth.verifyIdToken).toHaveBeenCalledWith('token-valido')
  })

  it('should call with verify google - production', async () => {
    mockAppConfig.env = 'production'
    mockRequest.headers = { authorization: 'Bearer token-valido' }
    mockFirebaseAuth.verifyIdToken.mockResolvedValue({
      uid: 'uid-valido',
    } as any)

    mockFirebaseAuth.getUser.mockReturnThis()

    await service.use(mockRequest, mockResponse, mockNext)

    expect(mockFirebaseAuth.getUser).toBeCalledTimes(1)
    expect(mockFirebaseAuth.getUser).toHaveBeenCalledWith('uid-valido')
    expect(mockFirebaseAuth.verifyIdToken).toBeCalledTimes(1)
    expect(mockFirebaseAuth.verifyIdToken).toHaveBeenCalledWith('token-valido')
  })
})
