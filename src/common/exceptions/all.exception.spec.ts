import { Test, TestingModule } from '@nestjs/testing'

import { AllException } from './all.exception'
import { TipoErro } from '../enums/tipo-erro.enum'
import { HttpStatus } from '@nestjs/common'
jest.mock('../constants/exceptions', () => {
  return {
    COMMON_ERRORS: [
      {
        errorId: -1,
        message: 'Catioro',
        httpStatus: 403,
      },
    ],
  }
})
describe('Validation all exception', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AllException],
    }).compile()
    module.init()
  })

  it('should be defined', () => {
    const allException = new AllException(TipoErro.DOCUMENTO_NAO_ENCONTRADO)
    expect(allException).toBeDefined()
  })

  it('should be return correct common', () => {
    const exCommonErrors = {
      errorId: -1,
      message: 'Catioro',
      httpStatus: HttpStatus.FORBIDDEN,
    }
    const allException = new AllException(-1)
    expect(allException.tipoErroDado).toStrictEqual(exCommonErrors)
  })

  it('should be return correct new error', () => {
    const exCommonErrors = {
      errorId: 2,
      message: 'Erro desconhecido',
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    }
    const allException = new AllException(2)
    expect(allException.tipoErroDado).toStrictEqual(exCommonErrors)
  })

  it('should be return just error and message', () => {
    const exCommonErrors = {
      errorId: 1,
      message: 'Erro nao catalogado',
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    }
    const allException = new AllException(1, 'Erro nao catalogado')
    expect(allException.tipoErroDado).toStrictEqual(exCommonErrors)
  })
})
