import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { Disponibilidade } from './disponibilidade.entity'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Disponibilidade]),
    forwardRef(() => PrestadoresEntityModule),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class DisponibilidadesEntityModule {}
