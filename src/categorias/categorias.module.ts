import { Module } from '@nestjs/common'
import { CategoriasEntityModule } from '../models/categorias/categorias.module'
import { CategoriasController } from './categorias.controller'
import { CategoriasService } from './categorias.service'

@Module({
  imports: [CategoriasEntityModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
