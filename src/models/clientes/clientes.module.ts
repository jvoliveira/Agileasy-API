import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cliente } from './cliente.entity'
import { CartoesEntityModule } from '../cartoes/cartoes.module'
import { EnderecosEntityModule } from '../enderecos/enderecos.module'
import { UsuariosEntityModule } from '../usuarios/usuarios.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    forwardRef(() => CartoesEntityModule),
    forwardRef(() => EnderecosEntityModule),
    forwardRef(() => UsuariosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class ClientesEntityModule {}
