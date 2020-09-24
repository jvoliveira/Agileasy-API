import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { Reflector } from '@nestjs/core'
import { Claims } from './interfaces/claims.interface'
import { AllException } from '../exceptions/all.exception'
import { TipoErro } from '../enums/tipo-erro.enum'
import { AppConfigService } from '../../config/app/config.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private firebaseAuth: FirebaseAuthenticationService,
    private reflector: Reflector,
    private appConfig: AppConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lê as roles permitidas daquela requisição em específico para o método
    const roles = this.reflector.get<number[]>('roles', context.getHandler())
    if (!roles) {
      return true
    }
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    try {
      // Verifica se o cabelhaço tem o campo de autorização
      if ('authorization' in request.headers) {
        const authorization = request.headers['authorization'] as string
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
        // Verifica se aquele usuário possui um customClaim
        if (auth.customClaims !== undefined) {
          const claims = auth.customClaims as Claims
          // Verifica realmente se tem a permissão para determinado método
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
