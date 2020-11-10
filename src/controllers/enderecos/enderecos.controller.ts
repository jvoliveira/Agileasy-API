import { Controller, Get } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { UserService } from '../../common/services/user.service'
import { EnderecosService } from './enderecos.service'
import * as admin from 'firebase-admin'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'

@Controller('enderecos')
export class EnderecosController {
  constructor(
    private serv: EnderecosService,
    private userService: UserService,
  ) {}

  @Roles(TipoUsuario.CLIENTE)
  @Get('cliente/eu')
  public async getEnderecosByCliente(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    const enderecos = await this.serv.getEnderecosByCliente(
      clienteIncompleto.id,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        enderecos,
      },
    }
  }
}
