import { Module } from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { ClientesController } from './clientes.controller'
import { ClientesEntityModule } from '../models/clientes/clientes.module'
import { UserService } from '../common/services/user.service'
import { UsuariosEntityModule } from '../models/usuarios/usuarios.module'

@Module({
  imports: [ClientesEntityModule, UsuariosEntityModule],
  providers: [ClientesService, UserService],
  controllers: [ClientesController],
})
export class ClientesModule {}
