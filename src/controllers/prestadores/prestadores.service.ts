import { Injectable } from '@nestjs/common'
import { Prestador } from '../../models/prestadores/prestador.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { AllException } from '../../common/exceptions/all.exception'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { Servico } from '../../models/servicos/servico.entity'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'
import { TipoStatus } from '../../models/usuarios/usuario.interface'

@Injectable()
export class PrestadoresService extends BaseService<Prestador> {
  constructor(@InjectRepository(Prestador) repo: Repository<Prestador>) {
    super(repo)
  }

  async getAllPrestadorAtivos(): Promise<Prestador[]> {
    const values: Array<Prestador> = await this.repo.find({
      where: { ativo: true, usuario: { status: TipoStatus.ativo } },
    })

    if (!values) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return values
  }

  async getPrestadorByCategoria(idCategoria: number): Promise<Prestador[]> {
    const values: Array<Prestador> = await this.repo
      .createQueryBuilder('prestador')
      .leftJoinAndSelect('prestador.categorias', 'c')
      .leftJoinAndSelect('prestador.servicos', 's')
      .leftJoinAndSelect('prestador.usuario', 'u')
      .where(
        'c.id = :idCategoria and prestador.ativo = true and c.ativo = true and u.status = ' +
          TipoStatus.ativo,
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

  async addServicos(
    idPrestador: number,
    servicos: Servico[],
  ): Promise<Prestador> {
    const prestador = await this.repo.findOneOrFail(idPrestador, {
      relations: ['servicos'],
    })

    if (!prestador.servicos) {
      prestador.servicos = []
    }

    prestador.servicos.push(...servicos)

    const value = await this.repo.save(prestador)

    if (!value) {
      throw new AllException(TipoErro.ERROR_AO_ATUALIZAR)
    }

    return value
  }

  async addDisponibilidades(
    idPrestador: number,
    servicos: Disponibilidade[],
  ): Promise<Prestador> {
    const prestador = await this.repo.findOneOrFail(idPrestador, {
      relations: ['disponibilidades'],
    })

    if (!prestador.disponibilidades) {
      prestador.disponibilidades = []
    }

    prestador.disponibilidades.push(...servicos)

    const value = await this.repo.save(prestador)

    if (!value) {
      throw new AllException(TipoErro.ERROR_AO_ATUALIZAR)
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

  async getPrestadoresWithCategoria(): Promise<Prestador[]> {
    const values: Array<Prestador> = await this.repo.find({
      where: { ativo: true },
      relations: ['categorias'],
    })

    if (!values) {
      throw new AllException(TipoErro.ID_NAO_ENCONTRADO)
    }

    return values
  }

  async getAllInformation(id: number): Promise<Prestador> {
    return this.repo.findOneOrFail(id, {
      relations: ['usuario', 'endereco', 'pedidos', 'servicos', 'categorias'],
    })
  }

  async getAllInformationWithoutPedidos(id: number): Promise<Prestador> {
    return this.repo.findOneOrFail(id, {
      relations: [
        'usuario',
        'endereco',
        'servicos',
        'categorias',
        'disponibilidades',
      ],
    })
  }
}
