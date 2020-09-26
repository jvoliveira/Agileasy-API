import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response } from 'express'
import { RequestAuth } from '../interfaces/request-auth.interface'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { AppConfigService } from '../../config/app/config.service'
import { AllException } from '../exceptions/all.exception'
import { TipoErro } from '../enums/tipo-erro.enum'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private firebaseAuth: FirebaseAuthenticationService,
    private appConfig: AppConfigService,
  ) {}

  async use(req: RequestAuth, res: Response, next: () => void) {
    try {
      if ('authorization' in req.headers) {
        const authorization = req.headers['authorization'] as string
        // Lê o token enviado
        const authToken = authorization.substring(7)
        // Caso o ambiente não seja de teste ele verifica no firebase a validade daquele token
        const decodeId = await this.firebaseAuth.verifyIdToken(authToken)
        const auth = await this.firebaseAuth.getUser(decodeId.uid)
        req.user = auth
      }
    } catch (error) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }

    next()
  }
}
