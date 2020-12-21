import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FolhaRespostaEntityModule } from '../folha-resposta/folha-reposta.module'
import { VariacaoServicoEntityModule } from '../servico-variacao/variacao-servico.module'
import { Alternativa } from './alternativa.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Alternativa]),
    forwardRef(() => VariacaoServicoEntityModule),
    forwardRef(() => FolhaRespostaEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class AlternativaEntityModule {}
