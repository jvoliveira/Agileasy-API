import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Avaliacao } from '../../models/avaliacao/avaliacao.entity'

@Injectable()
export class AvaliacoesService extends BaseService<Avaliacao> {
  constructor(@InjectRepository(Avaliacao) repo: Repository<Avaliacao>) {
    super(repo)
  }
}
