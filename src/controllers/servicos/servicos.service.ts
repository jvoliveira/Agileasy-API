import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Servico } from '../../models/servicos/servico.entity'

@Injectable()
export class ServicosService extends BaseService<Servico> {
  constructor(@InjectRepository(Servico) repo: Repository<Servico>) {
    super(repo)
  }

  async getByIdWithPrestador(id: number): Promise<Servico> {
    const servico = this.repo.findOneOrFail(id, { relations: ['prestador'] })
    return servico
  }
}
