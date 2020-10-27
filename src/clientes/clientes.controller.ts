import { Controller, Get } from '@nestjs/common'
import { Roles } from '../common/decorators/roles.decorator'
import { ResponseDefault } from '../common/interfaces/response-default.interface'
import { UserService } from '../common/services/user.service'
import * as admin from 'firebase-admin'
import { ClientesService } from './clientes.service'
import { User } from '../common/decorators/user.decorator'
import { TipoErro } from '../common/enums/tipo-erro.enum'

@Controller('clientes')
export class ClientesController {
  constructor(
    private serv: ClientesService,
    private userService: UserService,
  ) {}

  @Roles(200)
  @Get('eu')
  public async getAllInformation(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    const cliente = await this.serv.getAllInformation(clienteIncompleto.id)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente,
      },
    }
  }
}
