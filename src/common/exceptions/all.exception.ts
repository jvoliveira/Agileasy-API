import { HttpException, HttpStatus } from '@nestjs/common'
import { TipoErro } from './enums/tipo-erro.enum'
import { COMMON_ERRORS } from '../constants/settings'
import { TipoErroDados } from './interfaces/tipo-erro-dados.interface'

export class AllException extends HttpException {
  public tipoErroDado: TipoErroDados
  constructor(errorId: TipoErro, message?: string, httpStatus?: HttpStatus) {
    let newTipoErroDado: TipoErroDados =
      message && httpStatus
        ? { errorId: errorId, message, httpStatus }
        : message
        ? {
            errorId: errorId,
            message,
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          }
        : {
            errorId,
            message: 'Erro desconhecido',
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          }

    for (const error of COMMON_ERRORS) {
      if (errorId == error.errorId) {
        newTipoErroDado = error
      }
    }
    super(newTipoErroDado.message, newTipoErroDado.httpStatus)
    this.tipoErroDado = newTipoErroDado
  }
}
