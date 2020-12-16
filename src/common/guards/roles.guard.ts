import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { Reflector } from '@nestjs/core'
import { Claims } from './interfaces/claims.interface'
import { AllException } from '../exceptions/all.exception'
import { TipoErro } from '../enums/tipo-erro.enum'
import { AppConfigService } from '../../config/app/config.service'
import { RequestAuth } from '../interfaces/request-auth.interface'

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
    if (!roles || roles.includes(-1)) {
      return true
    }
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<RequestAuth>()
    const auth = request.user

    // Verifica se aquele usuário possui um customClaim
    if (auth.customClaims !== undefined) {
      const claims = auth.customClaims as Claims
      // Verifica realmente se tem a permissão para determinado método
      if (roles.some(r => claims.roles.indexOf(r) >= 0)) {
        return true
      } else {
        throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
      }
    }

    throw new AllException(TipoErro.SEM_AUTENTICACAO)
  }
}
