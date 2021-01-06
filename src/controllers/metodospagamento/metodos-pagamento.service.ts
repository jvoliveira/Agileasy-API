import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
import { BaseService } from '../../common/services/base.service'
import { MetodoPagamento } from '../../models/metodos-pagamento/metodo-pagamento.entity'
import { TipoPagamento } from '../../models/metodos-pagamento/metodo-pagamento.interface'

@Injectable()
export class MetodosPagamentoService extends BaseService<MetodoPagamento> {
  constructor(
    @InjectRepository(MetodoPagamento) repo: Repository<MetodoPagamento>,
  ) {
    super(repo)
  }

  async commons(): Promise<MetodoPagamento[]> {
    const values: Array<MetodoPagamento> = await this.repo.find({
      where: { ativo: true, cartao: null },
    })

    if (!values) {
      throw new AllException(TipoErro.DOCUMENTO_NAO_ENCONTRADO)
    }

    return values
  }

  async getCartoes(idCliente: number): Promise<MetodoPagamento[]> {
    const values: Array<MetodoPagamento> = await this.repo
      .createQueryBuilder('metodo_pagamento')
      .leftJoinAndSelect('metodo_pagamento.cartao', 'c')
      .leftJoin('c.cliente', 'cli')
      .where('cli.id = :idCliente and metodo_pagamento.ativo = true', {
        idCliente,
      })
      .getMany()

    for (const value of values) {
      delete value.cartao.cvv
      delete value.cartao.mes
      delete value.cartao.ano
    }

    if (!values) {
      throw new AllException(TipoErro.DOCUMENTO_NAO_ENCONTRADO)
    }

    return values
  }
}
