import { Injectable } from '@nestjs/common'
import { Prestador } from '../models/prestadores/prestador.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../common/services/base.service'
import { Categoria } from '../models/categorias/categoria.entity'
import { AllException } from '../common/exceptions/all.exception'
import { TipoErro } from '../common/enums/tipo-erro.enum'

@Injectable()
export class PrestadoresService extends BaseService<Prestador> {
  constructor(@InjectRepository(Prestador) repo: Repository<Prestador>) {
    super(repo)
  }

  async getPrestadorByCategoria(idCategoria: number): Promise<Prestador[]> {
    const values: Array<Prestador> = await this.repo
      .createQueryBuilder()
      .where({ ativo: true })
      .relation(Categoria, 'prestadores')
      .of(idCategoria)
      .loadMany()

    if (!values) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return values
  }
}
