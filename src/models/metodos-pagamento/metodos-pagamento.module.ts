import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MetodoPagamento } from './metodo-pagamento.entity'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { CartoesEntityModule } from '../cartoes/cartoes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MetodoPagamento]),
    forwardRef(() => PedidosEntityModule),
    forwardRef(() => CartoesEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class MetodosPagamentoEntityModule {}
