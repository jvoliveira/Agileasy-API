import { Module } from '@nestjs/common'
import { CuponsEntityModule } from '../../models/cupons/cupom.module'
import { CuponsService } from './cupons.service'
import { CuponsController } from './cupons.controller'
import { UserService } from '../../common/services/user.service'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { PedidosService } from '../pedidos/pedidos.service'
import { PedidosEntityModule } from '../../models/pedidos/pedidos.module'

@Module({
  imports: [CuponsEntityModule, UsuariosEntityModule, PedidosEntityModule],
  providers: [CuponsService, UserService, PedidosService],
  controllers: [CuponsController],
})
export class CuponsModule {}
