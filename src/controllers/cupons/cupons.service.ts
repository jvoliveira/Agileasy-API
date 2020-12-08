import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Cupom } from '../../models/cupons/cupom.entity'

@Injectable()
export class CuponsService extends BaseService<Cupom> {
  constructor(@InjectRepository(Cupom) repo: Repository<Cupom>) {
    super(repo)
  }
}
