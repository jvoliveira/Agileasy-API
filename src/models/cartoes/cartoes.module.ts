import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cartao } from './cartao.entity'
import { JsonHelperModule } from '../../common/helpers/json.module'
import { BaseModelModule } from '../basis/basis.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cartao]),
    JsonHelperModule,
    BaseModelModule,
  ],
  exports: [TypeOrmModule],
})
export class CartoesModule {}
