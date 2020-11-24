import { Controller, Param, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { UserService } from '../../common/services/user.service'
import { PedidosService } from '../pedidos/pedidos.service'
import { ChatsService } from './chats.service'
import * as admin from 'firebase-admin'

@Controller('chats')
export class ChatsController {
  constructor(
    private chatService: ChatsService,
    private userService: UserService,
    private pedidoService: PedidosService,
  ) {}

  @Post(':id/iniciar/cliente/eu')
  @Roles(TipoUsuario.CLIENTE)
  public async beginChatAsCliente(
    @Param('id') id: number,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const cliente = await this.userService.getClienteByToken(user.uid)
    const pedido = await this.pedidoService.getByIdAsCliente(
      id,
      cliente.id,
      true,
    )
    if (pedido.fidChat) {
      return {
        error_id: TipoErro.SEM_ERROS,
        message: 'Sucesso!',
        error: false,
        data: {
          fidChat: pedido.fidChat,
        },
      }
    }

    const fidChat = this.chatService.createChat(
      id,
      pedido.prestador.id,
      cliente.id,
      'cliente',
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        fidChat: fidChat,
      },
    }
  }

  @Post(':id/iniciar/prestador/eu')
  @Roles(TipoUsuario.CLIENTE)
  public async beginChatAsPrestador(
    @Param('id') id: number,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestador = await this.userService.getPrestadorByToken(user.uid)
    const pedido = await this.pedidoService.getByIdAsPrestador(
      id,
      prestador.id,
      true,
    )
    if (pedido.fidChat) {
      return {
        error_id: TipoErro.SEM_ERROS,
        message: 'Sucesso!',
        error: false,
        data: {
          fidChat: pedido.fidChat,
        },
      }
    }

    const fidChat = this.chatService.createChat(
      id,
      prestador.id,
      pedido.cliente.id,
      'prestador',
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        fidChat: fidChat,
      },
    }
  }
}
