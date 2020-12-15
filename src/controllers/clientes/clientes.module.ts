import { Module } from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { ClientesController } from './clientes.controller'
import { ClientesEntityModule } from '../../models/clientes/clientes.module'
import { UserService } from '../../common/services/user.service'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { PrestadoresEntityModule } from '../../models/prestadores/prestadores.module'

@Module({
  imports: [
    ClientesEntityModule,
    UsuariosEntityModule,
    PrestadoresEntityModule,
  ],
  providers: [ClientesService, UserService, PrestadoresService],
  controllers: [ClientesController],
})
export class ClientesModule {}
