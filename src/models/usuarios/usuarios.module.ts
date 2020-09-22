import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './usuario.entity'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'
import { ClientesEntityModule } from '../clientes/clientes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => PrestadoresEntityModule),
    forwardRef(() => ClientesEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class UsuariosEntityModule {}
