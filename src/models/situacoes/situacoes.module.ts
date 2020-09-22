import { Module, forwardRef } from '@nestjs/common'
import { Situacao } from './situacao.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosEntityModule } from '../pedidos/pedidos.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Situacao]),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class SituacoesEntityModule {}
