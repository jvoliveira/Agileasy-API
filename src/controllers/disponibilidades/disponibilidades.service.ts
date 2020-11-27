import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
import { BaseService } from '../../common/services/base.service'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'

@Injectable()
export class DisponibilidadesService extends BaseService<Disponibilidade> {
  constructor(
    @InjectRepository(Disponibilidade) repo: Repository<Disponibilidade>,
  ) {
    super(repo)
  }

  async getAllDisponibilidesByPrestador(
    idPrestador: number,
  ): Promise<Disponibilidade[]> {
    return this.repo.find({
      where: { prestador: { id: idPrestador } },
    })
  }

  async updateAllDisponibilidade(
    idPrestador: number,
    disponibilidades: Disponibilidade[],
  ): Promise<Disponibilidade[]> {
    const queryRunner = this.repo.manager.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      await queryRunner.manager.delete(Disponibilidade, {
        prestador: { id: idPrestador },
      })
      const newDisponibilidades = await queryRunner.manager.save<
        Disponibilidade
      >(disponibilidades)

      await queryRunner.commitTransaction()
      await queryRunner.release()
      return newDisponibilidades
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new AllException(TipoErro.ERROR_AO_SALVAR)
    }
  }
}
