import { override } from '@hapi/joi'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import { AllException } from '../common/exceptions/all.exception'
import { BaseService } from '../common/services/base.service'
import { Pedido } from '../models/pedidos/pedido.entity'

@Injectable()
export class PedidosService extends BaseService<Pedido> {
  constructor(@InjectRepository(Pedido) repo: Repository<Pedido>) {
    super(repo)
  }
}
