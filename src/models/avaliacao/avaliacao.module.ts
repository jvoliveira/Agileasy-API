import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { Avaliacao } from './avaliacao.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Avaliacao]),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class AvaliacaoEntityModule {}
