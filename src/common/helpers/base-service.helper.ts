import { Repository } from 'typeorm'
import { TipoErro } from '../exceptions/enums/tipo-erro.enum'
import { AllException } from '../exceptions/all.exception'
import { BaseModel } from '../../models/basis/base.entity'

export class BaseServiceHelper<T extends BaseModel<T>> {
  constructor(protected repo: Repository<T>) {}

  async create(obj: any): Promise<T> {
    const status = await this.repo.save(obj)

    if (!status) {
      throw new AllException(TipoErro.ERROR_AO_SALVAR)
    }

    return status
  }

  async getByID(id: number): Promise<T> {
    const status = await this.repo.findOne(id, { where: { ativo: true } })

    if (!status) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }
    return status
  }

  async getAll(): Promise<T[]> {
    const cartoes: Array<T> = await this.repo.find({
      where: { ativo: true },
    })

    if (!cartoes) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }
    return cartoes
  }

  async update(obj: any): Promise<T> {
    const status = await this.repo.save(obj)
    if (!status) {
      throw new AllException(TipoErro.ERROR_AO_ATUALIZAR)
    }

    return status
  }

  async delete(id: number): Promise<T> {
    const status = await this.repo.findOne(id, { where: { ativo: true } })

    if (!status) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }
    status.ativo = false
    const statusDelete = await this.repo.save(status as any)

    if (!statusDelete) {
      throw new AllException(TipoErro.ERROR_AO_DELETAR)
    }
    return statusDelete
  }
}
