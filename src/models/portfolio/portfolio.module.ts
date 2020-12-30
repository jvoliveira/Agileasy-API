import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Informacao } from '../informacao/informacao.entity'
import { Portfolio } from './portfolio.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    forwardRef(() => Informacao),
  ],
  exports: [TypeOrmModule],
})
export class PortfolioEntityModule {}
