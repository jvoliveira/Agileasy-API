import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AllException } from './all.exception'
import { TipoErro } from '../enums/tipo-erro.enum'

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
      // Define a mensagem padrão ser erro desconhecido
      let message = 'Erro desconhecido'
      let error_id = TipoErro.ERROR_DESCONHECIDO
      // Caso a exceção seja uma exceção HTTP genérica
      if (exception instanceof HttpException) {
        // Pega a resposta
        const response = exception.getResponse()
        error_id = exception.getStatus()
        // Caso seja um objeto acessa o seu atributo message
        if (response instanceof Object) {
          const msg = response['message']
          // Se for um array pega a primeira posição, caso não pega a string retornada no objeto message
          if (msg instanceof Array) {
            message = response['message'][0]
          } else {
            message = response['message']
          }
        } else {
          // Pega simplesmente a resposta que também pode ser uma string
          message = response
        }
      }
      response.status(status).json({
        error: true,
        error_id,
        data: [],
        message,
      })
    }
  }
}
