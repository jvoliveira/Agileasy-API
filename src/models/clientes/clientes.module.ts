import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cliente } from './cliente.entity'
import { BaseModelModule } from '../basis/basis.module'
import { JsonHelperModule } from '../../common/helpers/json.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    JsonHelperModule,
    BaseModelModule,
  ],
  exports: [TypeOrmModule],
})
export class ClientesModule {}
