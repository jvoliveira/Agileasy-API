import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VariacaoServicoEntityModule } from '../servico-variacao/variacao-servico.module'
import { Alternativa } from './alternativa.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Alternativa]),
    forwardRef(() => VariacaoServicoEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class AlternativaEntityModule {}
