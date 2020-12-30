import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InformacaoEntityModule } from '../informacao/informacao.module'
import { Portfolio } from './portfolio.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    forwardRef(() => InformacaoEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class PortfolioEntityModule {}
