import { Module, forwardRef } from '@nestjs/common'
import { Servico } from './servico.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriasEntityModule } from '../categorias/categorias.module'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Servico]),
    CategoriasEntityModule,
    forwardRef(() => PedidosEntityModule),
    forwardRef(() => PrestadoresEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class ServicosEntityModule {}
