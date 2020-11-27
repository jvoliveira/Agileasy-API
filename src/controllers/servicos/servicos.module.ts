import { Module } from '@nestjs/common'
import { UserService } from '../../common/services/user.service'
import { ServicosEntityModule } from '../../models/servicos/servicos.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { ServicosController } from './servicos.controller'
import { ServicosService } from './servicos.service'

@Module({
  imports: [ServicosEntityModule, UsuariosEntityModule],
  controllers: [ServicosController],
  providers: [ServicosService, UserService],
})
export class ServicosModule {}
