import { Body, CacheTTL, Controller, Get, Put } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'
import { ClientesService } from './clientes.service'
import { User } from '../../common/decorators/user.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { UpdateTokenDto } from './dto/update-token.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'

@Controller('clientes')
export class ClientesController {
  constructor(
    private serv: ClientesService,
    private userService: UserService,
  ) {}

  @Roles(TipoUsuario.CLIENTE)
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

  @Roles(TipoUsuario.CLIENTE)
  @Put('/atualizar/notificacao/eu')
  public async changeTokenNotificacao(
    @User() user: admin.auth.UserRecord,
    @Body() token: UpdateTokenDto,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)

    this.userService.update(clienteIncompleto.usuario.id, {
      tokenNotificacao: token.tokenNotificacao,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Put('/atualizar/dados-cadastrais/eu')
  public async changeAccountData(
    @User() user: admin.auth.UserRecord,
    @Body() usuario: UpdateClienteDto,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    if (clienteIncompleto.usuario.cpf) {
      usuario.cpf = clienteIncompleto.usuario.cpf
    }

    this.userService.update(clienteIncompleto.usuario.id, usuario)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
  }
}
