import { Module, forwardRef } from '@nestjs/common'
import { Pedido } from './pedido.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServicosEntityModule } from '../servicos/servicos.module'
import { EnderecosEntityModule } from '../enderecos/enderecos.module'
import { MetodosPagamentoEntityModule } from '../metodos-pagamento/metodos-pagamento.module'
import { SituacoesEntityModule } from '../situacoes/situacoes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    forwardRef(() => ServicosEntityModule),
    forwardRef(() => EnderecosEntityModule),
    forwardRef(() => MetodosPagamentoEntityModule),
    forwardRef(() => SituacoesEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class PedidosEntityModule {}
