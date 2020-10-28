import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../common/services/base.service'
import { Endereco } from '../models/enderecos/endereco.entity'

@Injectable()
export class EnderecosService extends BaseService<Endereco> {
  constructor(@InjectRepository(Endereco) repo: Repository<Endereco>) {
    super(repo)
  }

  async getByIdWithCliente(id: number): Promise<Endereco> {
    const servico = this.repo.findOneOrFail(id, { relations: ['cliente'] })
    return servico
  }
}
