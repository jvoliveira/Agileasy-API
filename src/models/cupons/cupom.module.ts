import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cupom } from './cupom.entity'
import { ClientesEntityModule } from '../clientes/clientes.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cupom]),
    forwardRef(() => ClientesEntityModule),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class CuponsEntityModule {}
