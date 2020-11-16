import { Module } from '@nestjs/common'
import { ClientesEntityModule } from '../../models/clientes/clientes.module'
import { PrestadoresEntityModule } from '../../models/prestadores/prestadores.module'
import { ClientesService } from '../clientes/clientes.service'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { RegistrarController } from './registrar.controller'

@Module({
  imports: [PrestadoresEntityModule, ClientesEntityModule],
  providers: [PrestadoresService, ClientesService],
  controllers: [RegistrarController],
})
export class RegistrarModule {}
