import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from './categoria.entity'
import { ServicosEntityModule } from '../servicos/servicos.module'
import { PrestadoresEntityModule } from '../prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria]),
    forwardRef(() => ServicosEntityModule),
    forwardRef(() => PrestadoresEntityModule),
  ],
  exports: [TypeOrmModule],
})
export class CategoriasEntityModule {}
