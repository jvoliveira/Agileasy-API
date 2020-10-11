import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import { AllException } from '../common/exceptions/all.exception'
import { BaseService } from '../common/services/base.service'
import { Categoria } from '../models/categorias/categoria.entity'

@Injectable()
export class CategoriasService extends BaseService<Categoria> {
  constructor(@InjectRepository(Categoria) repo: Repository<Categoria>) {
    super(repo)
  }

  async getParents(): Promise<Categoria[]> {
    const values: Array<Categoria> = await this.repo.find({
      where: { ativo: true, catPai: null },
    })

    if (!values) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return values
  }
}
