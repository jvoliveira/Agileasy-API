import { Module } from '@nestjs/common'
import { CuponsEntityModule } from '../../models/cupons/cupom.module'
import { CuponsService } from './cupons.service'
import { CuponsController } from './cupons.controller';

@Module({
  imports: [CuponsEntityModule],
  providers: [CuponsService],
  controllers: [CuponsController],
})
export class CuponsModule {}
