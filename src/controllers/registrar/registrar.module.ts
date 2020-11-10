import { Module } from '@nestjs/common'
import { PrestadoresEntityModule } from '../models/prestadores/prestadores.module'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { RegistrarController } from './registrar.controller'

@Module({
    imports: [PrestadoresEntityModule],
    providers:[PrestadoresService],
    controllers: [RegistrarController],
})
export class RegistrarModule {}
