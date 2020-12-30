import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PortfolioEntityModule } from '../portfolio/portfolio.module'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'
import { Informacao } from './informacao.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Informacao]),
    forwardRef(() => PortfolioEntityModule),
    forwardRef(() => PrestadoresEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class InformacaoEntityModule {}
