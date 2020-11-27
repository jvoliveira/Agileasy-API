import { Module } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { PrestadoresController } from './prestadores.controller'
import { PrestadoresEntityModule } from '../../models/prestadores/prestadores.module'
import { UserService } from '../../common/services/user.service'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
@Module({
  imports: [PrestadoresEntityModule, UsuariosEntityModule],
  providers: [PrestadoresService, UserService],
  controllers: [PrestadoresController],
})
export class PrestadoresModule {}
