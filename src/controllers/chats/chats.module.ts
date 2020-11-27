import { Module } from '@nestjs/common'
import { UserService } from '../../common/services/user.service'
import { PedidosEntityModule } from '../../models/pedidos/pedidos.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { PedidosService } from '../pedidos/pedidos.service'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'

@Module({
  imports: [PedidosEntityModule, UsuariosEntityModule],
  controllers: [ChatsController],
  providers: [ChatsService, UserService, PedidosService],
})
export class ChatsModule {}
