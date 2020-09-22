import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Endereco } from './endereco.entity'
import { JsonHelperModule } from '../../common/helpers/json.module'
import { BaseModelModule } from '../basis/basis.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Endereco]),
    JsonHelperModule,
    BaseModelModule,
  ],
  exports: [TypeOrmModule],
})
export class EnderecosModule {}
