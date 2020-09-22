import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './usuario.entity'
import { BaseModelModule } from '../basis/basis.module'
import { JsonHelperModule } from '../../common/helpers/json.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    BaseModelModule,
    JsonHelperModule,
  ],
  exports: [TypeOrmModule],
})
export class UsuariosModule {}
