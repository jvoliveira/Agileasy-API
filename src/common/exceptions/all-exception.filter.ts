import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AllException } from './all.exception'
import { TipoErro } from './enums/tipo-erro.enum'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    if (exception instanceof AllException) {
      response.status(status).json({
        error: true,
        error_id: exception.tipoErroDado.errorId,
        data: [],
        message: exception.tipoErroDado.message,
      })
    } else {
      response.status(status).json({
        error: true,
        error_id: TipoErro.ERROR_DESCONHECIDO,
        data: [],
        message: 'Erro desconhecido',
      })
    }
  }
}
