import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Portfolio } from '../portfolio/portfolio.entity'
import { Informacao } from './informacao.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Informacao]),
    forwardRef(() => Portfolio),
  ],
  exports: [TypeOrmModule],
})
export class InformacaoEntityModule {}
