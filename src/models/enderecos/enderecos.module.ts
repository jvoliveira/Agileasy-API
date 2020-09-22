import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Endereco } from './endereco.entity'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'
import { ClientesEntityModule } from '../clientes/clientes.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Endereco]),
    forwardRef(() => PrestadoresEntityModule),
    forwardRef(() => ClientesEntityModule),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class EnderecosEntityModule {}
