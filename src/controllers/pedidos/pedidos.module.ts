import { Module } from '@nestjs/common'
import { PedidosEntityModule } from '../../models/pedidos/pedidos.module'
import { PedidosService } from './pedidos.service'
import { PedidosController } from './pedidos.controller'
import { ServicosService } from '../servicos/servicos.service'
import { ServicosEntityModule } from '../../models/servicos/servicos.module'
import { UserService } from '../../common/services/user.service'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { EnderecosService } from '../enderecos/enderecos.service'
import { EnderecosEntityModule } from '../../models/enderecos/enderecos.module'

@Module({
  imports: [
    PedidosEntityModule,
    ServicosEntityModule,
    UsuariosEntityModule,
    EnderecosEntityModule,
  ],
  providers: [PedidosService, ServicosService, UserService, EnderecosService],
  controllers: [PedidosController],
})
export class PedidosModule {}
