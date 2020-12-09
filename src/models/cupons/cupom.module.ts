import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cupom } from './cupom.entity'
import { ClientesEntityModule } from '../clientes/clientes.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cupom]),
    forwardRef(() => ClientesEntityModule),
    forwardRef(() => PrestadoresEntityModule),
    forwardRef(() => PedidosEntityModule),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class CuponsEntityModule {}
