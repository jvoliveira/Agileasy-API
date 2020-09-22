import { Module } from '@nestjs/common'
import { Pedido } from './pedido.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JsonHelperModule } from '../../common/helpers/json.module'
import { BaseModelModule } from '../basis/basis.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    JsonHelperModule,
    BaseModelModule,
  ],
  exports: [TypeOrmModule],
})
export class PedidosModule {}
