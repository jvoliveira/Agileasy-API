import { Module } from '@nestjs/common'
import { DisponibilidadesService } from './disponibilidades.service'
import { DisponibilidadesController } from './disponibilidades.controller'
import { DisponibilidadesEntityModule } from '../../models/disponibilidades/disponibilidade.module'

@Module({
  imports: [DisponibilidadesEntityModule],
  providers: [DisponibilidadesService],
  controllers: [DisponibilidadesController],
})
export class DisponibilidadesModule {}
