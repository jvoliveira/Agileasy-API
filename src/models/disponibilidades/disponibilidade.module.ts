import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Disponibilidade } from './disponibilidade.entity'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Disponibilidade]),
    forwardRef(() => PrestadoresEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class DisponibilidadesEntityModule {}
