import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { AlternativaEntityModule } from '../alternativa/alternativa.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    forwardRef(() => AlternativaEntityModule),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class FolhaRespostaEntityModule {}
