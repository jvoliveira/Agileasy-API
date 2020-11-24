import { Module } from '@nestjs/common'
import { PedidosEntityModule } from '../../models/pedidos/pedidos.module'
import { ChatsController } from './chats.controller'

@Module({
  imports: [PedidosEntityModule],
  controllers: [ChatsController],
})
export class ChatsModule {}
