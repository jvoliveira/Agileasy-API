import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Prestador } from './prestador.entity'
import { UsuariosEntityModule } from '../usuarios/usuarios.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { DisponibilidadesEntityModule } from '../disponibilidades/disponibilidade.module'
import { CuponsEntityModule } from '../cupons/cupom.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestador]),
    UsuariosEntityModule,
    forwardRef(() => PedidosEntityModule),
    forwardRef(() => CuponsEntityModule),
    forwardRef(() => DisponibilidadesEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class PrestadoresEntityModule {}
