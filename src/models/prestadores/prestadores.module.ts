import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Prestador } from './prestador.entity'
import { UsuariosEntityModule } from '../usuarios/usuarios.module'

@Module({
  imports: [TypeOrmModule.forFeature([Prestador]), UsuariosEntityModule],
  exports: [TypeOrmModule],
})
export class PrestadoresEntityModule {}
