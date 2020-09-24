import { Injectable } from '@nestjs/common'
import { Prestador } from '../models/prestadores/prestador.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseServiceHelper } from '../common/helpers/base-service.helper'

@Injectable()
export class PrestadoresService extends BaseServiceHelper<Prestador> {
  constructor(@InjectRepository(Prestador) repo: Repository<Prestador>) {
    super(repo)
  }
}
