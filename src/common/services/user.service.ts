import { Repository } from 'typeorm'
import { TipoErro } from '../enums/tipo-erro.enum'
import { AllException } from '../exceptions/all.exception'
import { Cliente } from '../../models/clientes/cliente.entity'
import { Prestador } from '../../models/prestadores/prestador.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Usuario } from '../../models/usuarios/usuario.entity'
import { BaseService } from './base.service'

@Injectable()
export class UserService extends BaseService<Usuario> {
  constructor(
    @InjectRepository(Usuario) private repoUsuario: Repository<Usuario>,
  ) {
    super(repoUsuario)
  }

  async getPrestadorByToken(uid: string): Promise<Prestador> {
    const status = await this.repoUsuario.findOne({
      relations: ['prestador'],
      where: { uid, ativo: true },
    })

    if (!status.prestador) {
      throw new AllException(TipoErro.ERRO_CONEXAO_BD)
    }

    return status.prestador
  }

  async getClienteByToken(uid: string): Promise<Cliente> {
    const status = await this.repoUsuario.findOne({
      relations: ['cliente'],
      where: { uid, ativo: true },
    })

    if (!status.cliente) {
      throw new AllException(TipoErro.ERRO_CONEXAO_BD)
    }

    return status.cliente
  }
}
