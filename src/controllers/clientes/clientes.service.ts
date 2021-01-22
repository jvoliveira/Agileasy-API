import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Cliente } from '../../models/clientes/cliente.entity'

@Injectable()
export class ClientesService extends BaseService<Cliente> {
  constructor(@InjectRepository(Cliente) repo: Repository<Cliente>) {
    super(repo)
  }

  async getAllInformation(id: number): Promise<Cliente> {
    return this.repo.findOneOrFail(id, {
      relations: ['usuario', 'enderecos', 'cartoes'],
    })
  }
}
