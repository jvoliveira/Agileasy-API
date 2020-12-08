import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
import { BaseService } from '../../common/services/base.service'
import { Cupom } from '../../models/cupons/cupom.entity'
import * as moment from 'moment-timezone'
import { TipoCupom } from '../../models/cupons/cupom.interface'

@Injectable()
export class CuponsService extends BaseService<Cupom> {
  constructor(@InjectRepository(Cupom) repo: Repository<Cupom>) {
    super(repo)
  }

  public async validateCupomNormal(codigo: string): Promise<Cupom> {
    const cupons = await this.repo.find({
      where: { codigo, ativo: true },
    })

    if (!cupons || cupons.length == 0) {
      throw new AllException(
        TipoErro.ID_NAO_ENCONTRADO,
        'Código não encontrado.',
      )
    }

    const cupom = cupons[0]

    if (!cupom) {
      throw new AllException(
        TipoErro.ID_NAO_ENCONTRADO,
        'Código não encontrado.',
      )
    }

    if (
      moment()
        .utc()
        .isAfter(moment(cupom.validade).utc())
    ) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'Cupom fora da validade.',
      )
    }

    if (cupom.restantes <= 0) {
      throw new AllException(TipoErro.DADOS_INVALIDOS, 'Cupom esgotado.')
    }

    if (cupom.tipoCupom !== TipoCupom.NORMAL) {
      throw new AllException(TipoErro.DADOS_INVALIDOS, 'Tipo de cupom inválido')
    }

    return cupom
  }
}
