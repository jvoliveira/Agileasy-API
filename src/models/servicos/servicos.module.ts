import { Module } from '@nestjs/common'
import { Servico } from './servico.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Servico])],
  exports: [TypeOrmModule],
})
export class ServicosModule {}
