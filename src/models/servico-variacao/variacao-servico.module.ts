import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlternativaEntityModule } from '../alternativa/alternativa.module'
import { ServicosEntityModule } from '../servicos/servicos.module'
import { VariacaoServico } from './variacao-servico.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([VariacaoServico]),
    forwardRef(() => ServicosEntityModule),
    forwardRef(() => AlternativaEntityModule),
  ],
})
export class VariacaoServicoEntityModule {}
