import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cartao } from './cartao.entity'
import { JsonHelperModule } from '../../common/helpers/json.module'
import { BaseModelModule } from '../basis/basis.module'
import { MetodosPagamentoEntityModule } from '../metodos-pagamento/metodos-pagamento.module'
import { ClientesEntityModule } from '../clientes/clientes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cartao]),
    forwardRef(() => MetodosPagamentoEntityModule),
    forwardRef(() => ClientesEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class CartoesEntityModule {}
