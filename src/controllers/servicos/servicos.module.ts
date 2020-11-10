import { Module } from '@nestjs/common'
import { ServicosEntityModule } from '../../models/servicos/servicos.module'
import { ServicosController } from './servicos.controller'
import { ServicosService } from './servicos.service'

@Module({
  imports: [ServicosEntityModule],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}
