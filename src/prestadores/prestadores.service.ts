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
      .createQueryBuilder('prestador')
      .leftJoinAndSelect('prestador.categorias', 'c')
      .leftJoinAndSelect('prestador.servicos', 's')
      .where(
        'c.id = :idCategoria and prestador.ativo = true and c.ativo = true',
        { idCategoria },
      )
      .getMany()

    if (!values) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return values
  }

  async addCategoria(
    idPrestador: number,
    categorias: number[],
  ): Promise<Prestador> {
    await this.repo
      .createQueryBuilder()
      .where({ ativo: true })
      .limit(1)
      .relation(Prestador, 'categorias')
      .of(idPrestador)
      .add(categorias)

    const value = await this.repo.findOne(idPrestador, {
      where: { ativo: true },
      relations: ['categorias'],
    })

    if (!value) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return value
  }

  async getServicosByPrestador(id: number): Promise<Prestador> {
    const prestador = await this.repo.findOne({
      where: { id: id },
      relations: ['servicos'],
    })

    if (!prestador) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return prestador
  }
}
