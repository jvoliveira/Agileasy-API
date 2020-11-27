import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cliente } from './cliente.entity'
import { CartoesEntityModule } from '../cartoes/cartoes.module'
import { EnderecosEntityModule } from '../enderecos/enderecos.module'
import { UsuariosEntityModule } from '../usuarios/usuarios.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { CuponsEntityModule } from '../cupons/cupom.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    forwardRef(() => CartoesEntityModule),
    forwardRef(() => EnderecosEntityModule),
    forwardRef(() => UsuariosEntityModule),
    forwardRef(() => PedidosEntityModule),
    forwardRef(() => CuponsEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class ClientesEntityModule {}
