import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosEntityModule } from '../pedidos/pedidos.module'
import { AlternativaEntityModule } from '../alternativa/alternativa.module'
import { FolhaResposta } from './folha-resposta.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([FolhaResposta]),
    forwardRef(() => AlternativaEntityModule),
    forwardRef(() => PedidosEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class FolhaRespostaEntityModule {}
