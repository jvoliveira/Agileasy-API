import { Module } from '@nestjs/common'
import { PedidosEntityModule } from '../models/pedidos/pedidos.module'
import { PedidosService } from './pedidos.service'
import { PedidosController } from './pedidos.controller'
import { ServicosService } from '../servicos/servicos.service'
import { ServicosEntityModule } from '../models/servicos/servicos.module'

@Module({
  imports: [PedidosEntityModule, ServicosEntityModule],
  providers: [PedidosService, ServicosService],
  controllers: [PedidosController],
})
export class PedidosModule {}
