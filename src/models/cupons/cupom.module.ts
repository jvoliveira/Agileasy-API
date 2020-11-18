import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cupom } from './cupom.entity'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cupom]),
    forwardRef(() => PrestadoresEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class CuponsEntityModule {}
