import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Prestador } from './prestador.entity'
import { UsuariosEntityModule } from '../usuarios/usuarios.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestador]),
    UsuariosEntityModule,
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class PrestadoresEntityModule {}
