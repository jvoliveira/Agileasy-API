import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Endereco } from '../../models/enderecos/endereco.entity'

@Injectable()
export class EnderecosService extends BaseService<Endereco> {
  constructor(@InjectRepository(Endereco) repo: Repository<Endereco>) {
    super(repo)
  }

  async getByIdWithClienteAndPrestador(id: number): Promise<Endereco> {
    const servico = this.repo.findOneOrFail(id, {
      relations: ['cliente', 'prestador'],
    })
    return servico
  }

  async getEnderecosByCliente(idCliente: number): Promise<Endereco[]> {
    const servico = await this.repo.find({
      where: { ativo: true, cliente: idCliente },
    })
    return servico
  }
}
