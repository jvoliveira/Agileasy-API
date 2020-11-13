import { Module } from '@nestjs/common'
import { MetodosPagamentoEntityModule } from '../../models/metodos-pagamento/metodos-pagamento.module'
import { MetodosPagamentoController } from './metodos-pagamento.controller'
import { MetodosPagamentoService } from './metodos-pagamento.service'

@Module({
  imports: [MetodosPagamentoEntityModule],
  controllers: [MetodosPagamentoController],
  providers: [MetodosPagamentoService],
})
export class MetodosPagamentoModule {}
