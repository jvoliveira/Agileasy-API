import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
import { BaseService } from '../../common/services/base.service'
import { Informacao } from '../../models/informacao/informacao.entity'
import { Portfolio } from '../../models/portfolio/portfolio.entity'
import { Prestador } from '../../models/prestadores/prestador.entity'

@Injectable()
export class InformacoesService extends BaseService<Informacao> {
  constructor(@InjectRepository(Informacao) repo: Repository<Informacao>) {
    super(repo)
  }

  public async getByIdPrestador(idPrestador: number): Promise<Informacao> {
    return this.repo.findOne({ where: { prestador: { id: idPrestador } } })
  }

  public async newInformacao(
    informacao: Informacao,
    capa: string,
    logo: string,
    nomePublico: string,
  ): Promise<Informacao> {
    const queryRunner = this.repo.manager.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      if (informacao.id) {
        await queryRunner.manager.delete(Portfolio, {
          informacao: { id: informacao.id },
        })
      }
      await queryRunner.manager.update(
        Prestador,
        { id: informacao.prestador.id },
        {
          capa,
          logo,
          nomePublico,
        },
      )
      const portfolios = informacao.portfolios
      delete informacao.portfolios
      const newInformacao = await queryRunner.manager.save(
        Informacao,
        informacao,
      )
      if (portfolios) {
        for (const portfolio of portfolios) {
          portfolio.informacao = { id: newInformacao.id } as any
        }
        const newPortfolios = await queryRunner.manager.save(
          Portfolio,
          portfolios,
        )

        newInformacao.portfolios = newPortfolios
      }
      await queryRunner.commitTransaction()
      await queryRunner.release()
      return newInformacao
    } catch (err) {
      console.log(err)
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new AllException(TipoErro.ERROR_AO_SALVAR)
    }
  }
}
