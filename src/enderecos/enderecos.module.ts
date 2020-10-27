import { Module } from '@nestjs/common'
import { EnderecosEntityModule } from '../models/enderecos/enderecos.module'
import { EnderecosService } from './enderecos.service'

@Module({
  imports: [EnderecosEntityModule],
  providers: [EnderecosService],
})
export class EnderecosModule {}
