import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { MetodoPagamento } from '../../models/metodos-pagamento/metodo-pagamento.entity'

@Injectable()
export class MetodosPagamentoService extends BaseService<MetodoPagamento> {
  constructor(
    @InjectRepository(MetodoPagamento) repo: Repository<MetodoPagamento>,
  ) {
    super(repo)
  }
}
