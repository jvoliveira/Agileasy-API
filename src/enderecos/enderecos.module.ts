import { Module } from '@nestjs/common'
import { EnderecosEntityModule } from '../models/enderecos/enderecos.module'
import { EnderecosService } from './enderecos.service'
import { EnderecosController } from './enderecos.controller'
import { UsuariosEntityModule } from '../models/usuarios/usuarios.module'
import { UserService } from '../common/services/user.service'

@Module({
  imports: [EnderecosEntityModule, UsuariosEntityModule],
  providers: [EnderecosService, UserService],
  controllers: [EnderecosController],
})
export class EnderecosModule {}
