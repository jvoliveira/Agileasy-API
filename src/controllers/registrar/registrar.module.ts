import { Module } from '@nestjs/common'
import { UserService } from '../../common/services/user.service'
import { ClientesEntityModule } from '../../models/clientes/clientes.module'
import { PrestadoresEntityModule } from '../../models/prestadores/prestadores.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { ClientesService } from '../clientes/clientes.service'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { RegistrarController } from './registrar.controller'

@Module({
  imports: [
    PrestadoresEntityModule,
    ClientesEntityModule,
    UsuariosEntityModule,
  ],
  providers: [PrestadoresService, ClientesService, UserService],
  controllers: [RegistrarController],
})
export class RegistrarModule {}
