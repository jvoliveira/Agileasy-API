import { Module } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { PrestadoresController } from './prestadores.controller'
import { PrestadoresEntityModule } from '../models/prestadores/prestadores.module'
import { CategoriasEntityModule } from '../models/categorias/categorias.module'
@Module({
  imports: [PrestadoresEntityModule, CategoriasEntityModule],
  providers: [PrestadoresService],
  controllers: [PrestadoresController],
})
export class PrestadoresModule {}
