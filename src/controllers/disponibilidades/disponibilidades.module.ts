import { Module } from '@nestjs/common';
import { DisponibilidadesService } from './disponibilidades.service';
import { DisponibilidadesController } from './disponibilidades.controller';

@Module({
  providers: [DisponibilidadesService],
  controllers: [DisponibilidadesController]
})
export class DisponibilidadesModule {}
