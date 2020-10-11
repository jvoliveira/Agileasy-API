import { Repository } from 'typeorm'
import { TipoErro } from '../enums/tipo-erro.enum'
import { AllException } from '../exceptions/all.exception'
import { Cliente } from '../../models/clientes/cliente.entity'
import { Prestador } from '../../models/prestadores/prestador.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Usuario } from '../../models/usuarios/usuario.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario) private repoUsuario: Repository<Usuario>,
  ) {}

  async getPrestadorByToken(token: string): Promise<Prestador> {
    const status = await this.repoUsuario.findOne({
      relations: ['prestador'],
      where: { token, ativo: true },
    })

    if (!status.prestador) {
      throw new AllException(TipoErro.ERRO_CONEXAO_BD)
    }

    return status.prestador
  }

  async getClienteByToken(token: string): Promise<Cliente> {
    const status = await this.repoUsuario.findOne({
      relations: ['cliente'],
      where: { token, ativo: true },
    })

    if (!status.cliente) {
      throw new AllException(TipoErro.ERRO_CONEXAO_BD)
    }

    return status.cliente
  }
}
