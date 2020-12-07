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
import { PrestadoresService } from '../prestadores/prestadores.service'
import { ClientesService } from '../clientes/clientes.service'
import { PrestadoresEntityModule } from '../../models/prestadores/prestadores.module'
import { ClientesEntityModule } from '../../models/clientes/clientes.module'
import { MailManager } from '../../common/mails/mail.manager'

@Module({
  imports: [
    PedidosEntityModule,
    ServicosEntityModule,
    UsuariosEntityModule,
    EnderecosEntityModule,
    PrestadoresEntityModule,
    ClientesEntityModule,
  ],
  providers: [
    PedidosService,
    ServicosService,
    UserService,
    EnderecosService,
    MailManager,
    PrestadoresService,
    ClientesService,
  ],
  controllers: [PedidosController],
})
export class PedidosModule {}
