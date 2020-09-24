import { Test, TestingModule } from '@nestjs/testing'

import { createMock } from '@golevelup/nestjs-testing'
import { RequestAuth } from '../interfaces/request-auth.interface'
import { Response } from 'express'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { AppConfigService } from '../../config/app/config.service'
import { Reflector } from '@nestjs/core'
import { ExecutionContext } from '@nestjs/common'
import { RolesGuard } from './roles.guard'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { AllException } from '../exceptions/all.exception'

describe('Testing auth middleware', () => {
  let service: RolesGuard
  let mockExecutionContext = createMock<ExecutionContext>()
  let mockReflector = createMock<Reflector>()
  let mockFirebaseAuth = createMock<FirebaseAuthenticationService>()
  let mockAppConfig = createMock<AppConfigService>()
  let mockRequestAuth = createMock<RequestAuth>() as any
  let mockHttpRequestArgument = createMock<HttpArgumentsHost>()

  beforeEach(async () => {
    jest.clearAllMocks()
    mockExecutionContext = createMock<ExecutionContext>()
    mockReflector = createMock<Reflector>()
    mockFirebaseAuth = createMock<FirebaseAuthenticationService>()
    mockAppConfig = createMock<AppConfigService>() as any
    mockRequestAuth = createMock<RequestAuth>() as any
    mockHttpRequestArgument = createMock<HttpArgumentsHost>()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { useValue: mockFirebaseAuth, provide: FirebaseAuthenticationService },
        { useValue: mockAppConfig, provide: AppConfigService },
        { useValue: mockReflector, provide: Reflector },
      ],
    }).compile()
    service = module.get<RolesGuard>(RolesGuard)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should not allow pass', async () => {
    mockReflector.get.mockReturnValue([0, 100])
    mockExecutionContext.switchToHttp.mockReturnValue(mockHttpRequestArgument)
    mockRequestAuth.user = {
      customClaims: {
        roles: [1, 2],
      },
    }
    mockHttpRequestArgument.getRequest.mockReturnValue(mockRequestAuth)

    await expect(service.canActivate(mockExecutionContext)).rejects.toThrow(
      AllException,
    )
  })

  it('should allow pass', async () => {
    mockReflector.get.mockReturnValue([0, 100])
    mockExecutionContext.switchToHttp.mockReturnValue(mockHttpRequestArgument)
    mockRequestAuth.user = {
      customClaims: {
        roles: [0, 100],
      },
    }
    mockHttpRequestArgument.getRequest.mockReturnValue(mockRequestAuth)

    await expect(service.canActivate(mockExecutionContext)).resolves.toBe(true)
  })
})
