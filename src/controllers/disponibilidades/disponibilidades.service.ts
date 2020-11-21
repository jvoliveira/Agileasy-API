import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'

@Injectable()
export class DisponibilidadesService extends BaseService<Disponibilidade> {
  constructor(
    @InjectRepository(Disponibilidade) repo: Repository<Disponibilidade>,
  ) {
    super(repo)
  }
}
