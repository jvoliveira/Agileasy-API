import { Injectable } from '@nestjs/common'
import { Prestador } from '../models/prestadores/prestador.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../common/services/base.service'

@Injectable()
export class PrestadoresService extends BaseService<Prestador> {
  constructor(@InjectRepository(Prestador) repo: Repository<Prestador>) {
    super(repo)
  }
}
