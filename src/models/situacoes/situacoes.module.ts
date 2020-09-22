import { Module } from '@nestjs/common'
import { Situacao } from './situacao.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JsonHelperModule } from '../../common/helpers/json.module'
import { BaseModelModule } from '../basis/basis.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Situacao]),
    JsonHelperModule,
    BaseModelModule,
  ],
  exports: [TypeOrmModule],
})
export class SituacoesModule {}
