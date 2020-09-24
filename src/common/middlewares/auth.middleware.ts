import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
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
        let uid = ''
        // Caso o ambiente seja de teste ele irá simplesmente pegar o auth como token ao invés de verificar na google
        if (this.appConfig.env === 'test') {
          uid = authToken
        } else {
          // Caso o ambiente não seja de teste ele verifica no firebase a validade daquele token
          const decodeId = await this.firebaseAuth.verifyIdToken(authToken)
          uid = decodeId.uid
        }
        const auth = await this.firebaseAuth.getUser(uid)
        req.user = auth
      }
    } catch (error) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }

    next()
  }
}
