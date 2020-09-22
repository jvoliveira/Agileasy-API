import { Module } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { PrestadoresController } from './prestadores.controller'
import { PrestadoresEntityModule } from '../models/prestadores/prestadores.module'
@Module({
  imports: [PrestadoresEntityModule],
  providers: [PrestadoresService],
  controllers: [PrestadoresController],
})
export class PrestadoresModule {}
