import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { Reflector } from '@nestjs/core'
import { Claims } from './interfaces/claims.interface'
import { AllException } from '../exceptions/all.exception'
import { TipoErro } from '../enums/tipo-erro.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private firebaseAuth: FirebaseAuthenticationService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getClass())
    if (!roles) {
      return true
    }
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    try {
      if ('authorization' in request.headers) {
        const authorization = request.headers['authorization'] as string
        const authToken = authorization.substring(7)
        const decodeId = await this.firebaseAuth.verifyIdToken(authToken)
        const auth = await this.firebaseAuth.getUser(decodeId.uid)
        if (auth.customClaims !== undefined) {
          const claims = auth.customClaims as Claims
          if (
            roles.includes(-1) ||
            roles.some(r => claims.roles.indexOf(r) >= 0)
          ) {
            return true
          } else {
            throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
          }
        }
      }
    } catch (error) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }

    throw new AllException(TipoErro.SEM_AUTENTICACAO)
  }
}
