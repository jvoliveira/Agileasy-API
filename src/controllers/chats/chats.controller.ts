import { Controller, Param, Patch, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { UserService } from '../../common/services/user.service'
import { PedidosService } from '../pedidos/pedidos.service'
import { ChatsService } from './chats.service'
import * as admin from 'firebase-admin'
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin'
import { DEFAULT_NOTIFICATION } from '../../common/constants/notification'

@Controller('chats')
export class ChatsController {
  constructor(
    private chatService: ChatsService,
    private userService: UserService,
    private pedidoService: PedidosService,
    private firebaseNotification: FirebaseMessagingService,
  ) {}

  @Patch(':id/iniciar/cliente/eu')
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
          pedido,
        },
      }
    }

    const fidChat = await this.chatService.createChat(
      id,
      pedido.prestador.id,
      cliente.id,
      'cliente',
    )

    const pedidoAtt = await this.pedidoService.update(id, { fidChat })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoAtt,
      },
    }
  }

  @Patch(':id/iniciar/prestador/eu')
  @Roles(TipoUsuario.PRESTADOR)
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
          pedido,
        },
      }
    }

    const fidChat = await this.chatService.createChat(
      id,
      prestador.id,
      pedido.cliente.id,
      'prestador',
    )

    const pedidoAtt = await this.pedidoService.update(id, { fidChat })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoAtt,
      },
    }
  }

  @Patch('pedido/:id/notificar/cliente')
  @Roles(TipoUsuario.PRESTADOR)
  public async notifyChatCliente(
    @Param('id') id: number,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestador = await this.userService.getPrestadorByToken(user.uid)
    const pedido = await this.pedidoService.getByIdAsPrestador(
      id,
      prestador.id,
      false,
    )
    const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
    newNotification.notification.title = 'Nova mensagem do seu pedido!! 😁'

    await this.chatService.canSendNotification(pedido.fidChat, 'cliente')

    if (pedido.cliente.tokenNotificacao) {
      newNotification.token = pedido.cliente.tokenNotificacao
    } else {
      newNotification.token = pedido.cliente.usuario.tokenNotificacao
    }

    await this.firebaseNotification.send(newNotification)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        sucesso: true,
      },
    }
  }

  @Patch('pedido/:id/notificar/prestador')
  @Roles(TipoUsuario.CLIENTE)
  public async notifyChatPrestador(
    @Param('id') id: number,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const cliente = await this.userService.getClienteByToken(user.uid)
    const pedido = await this.pedidoService.getByIdAsCliente(
      id,
      cliente.id,
      false,
    )
    await this.chatService.canSendNotification(pedido.fidChat, 'prestador')
    const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
    newNotification.notification.title = 'Nova mensagem do seu pedido!! 😁'
    if (pedido.prestador.tokenNotificacao) {
      newNotification.token = pedido.prestador.tokenNotificacao
    } else {
      newNotification.token = pedido.prestador.usuario.tokenNotificacao
    }

    await this.firebaseNotification.send(newNotification)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        sucesso: true,
      },
    }
  }
}
