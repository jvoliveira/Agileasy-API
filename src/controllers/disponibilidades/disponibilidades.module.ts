import { Module } from '@nestjs/common'
import { DisponibilidadesService } from './disponibilidades.service'
import { DisponibilidadesController } from './disponibilidades.controller'
import { DisponibilidadesEntityModule } from '../../models/disponibilidades/disponibilidade.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { UserService } from '../../common/services/user.service'

@Module({
  imports: [DisponibilidadesEntityModule, UsuariosEntityModule],
  providers: [DisponibilidadesService, UserService],
  controllers: [DisponibilidadesController],
})
export class DisponibilidadesModule {}
