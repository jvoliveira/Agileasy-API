import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from './categoria.entity'
import { JsonHelperModule } from '../../common/helpers/json.module'
import { BaseModelModule } from '../basis/basis.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria]),
    JsonHelperModule,
    BaseModelModule,
  ],
  exports: [TypeOrmModule],
})
export class CategoriasModule {}
