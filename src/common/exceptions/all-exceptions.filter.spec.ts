import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'

import { AllExceptionsFilter } from './all-exceptions.filter'
import { AllException } from './all.exception'

const mockJson = jest.fn()
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}))
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}))
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}))

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
}

describe('System header validation service', () => {
  let service: AllExceptionsFilter

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile()
    service = module.get<AllExceptionsFilter>(AllExceptionsFilter)
  })

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined()
    })

    it('All exception', () => {
      service.catch(
        new AllException(-20, 'Teste', HttpStatus.INTERNAL_SERVER_ERROR),
        mockArgumentsHost,
      )
      expect(mockHttpArgumentsHost).toBeCalledTimes(1)
      expect(mockHttpArgumentsHost).toBeCalledWith()
      expect(mockGetResponse).toBeCalledTimes(1)
      expect(mockGetResponse).toBeCalledWith()
      expect(mockStatus).toBeCalledTimes(1)
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(mockJson).toBeCalledTimes(1)
      expect(mockJson).toBeCalledWith({
        message: 'Teste',
        error_id: -20,
        error: true,
        data: [],
      })
    })
  })
})
