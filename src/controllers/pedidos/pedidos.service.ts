import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
import { BaseService } from '../../common/services/base.service'
import { FolhaResposta } from '../../models/folha-resposta/folha-resposta.entity'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { Situacao } from '../../models/situacoes/situacao.entity'
import { SituacaoInterface } from '../../models/situacoes/situacao.interface'

@Injectable()
export class PedidosService extends BaseService<Pedido> {
  constructor(@InjectRepository(Pedido) repo: Repository<Pedido>) {
    super(repo)
  }

  public async getPedidosAsCliente(id: number): Promise<Pedido[]> {
    return this.repo
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.prestador', 'prestador')
      .leftJoin('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.situacoes', 'situacoes')
      .leftJoinAndSelect('pedido.metodoPagamento', 'mp')
      .leftJoinAndSelect('pedido.endereco', 'endereco')
      .leftJoinAndSelect('pedido.servicos', 'servicos')
      .where('cliente.id = :id', { id })
      .orderBy({ 'situacoes.estado': 'ASC', 'pedido.dataHora': 'DESC' })
      .getMany()
  }

  public async getPedidosAsPrestador(id: number): Promise<Pedido[]> {
    return this.repo
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoin('pedido.prestador', 'prestador')
      .leftJoinAndSelect('pedido.situacoes', 'situacoes')
      .leftJoinAndSelect('pedido.metodoPagamento', 'mp')
      .leftJoinAndSelect('pedido.endereco', 'endereco')
      .leftJoinAndSelect('pedido.servicos', 'servicos')
      .where('prestador.id = :id', { id })
      .orderBy({ 'situacoes.estado': 'ASC', 'pedido.dataHora': 'DESC' })
      .getMany()
  }

  public async hasUsedCupomByCliente(
    idCliente: number,
    idCupom: number,
  ): Promise<void> {
    const count = await this.repo
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cupom', 'cup')
      .leftJoinAndSelect('pedido.cliente', 'cli')
      .where('cup.id = :idCupom and cli.id = :idCliente', {
        idCliente,
        idCupom,
      })
      .getCount()

    if (count !== 0) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'Você já usou esse cupom',
      )
    }
  }

  // Muda para a situação enviada por parâmetro
  public async changeSituacao(
    pedido: Pedido,
    situacao: SituacaoInterface,
  ): Promise<Pedido> {
    pedido.situacoes.push(situacao as Situacao)
    return this.repo.save(pedido)
  }

  // Retorna o pedido dado o id do pedido e prestador, os dois devem ser válidos se não retorna erro do próprio método
  // O parâmetro allData dita se vai trazer todas as relações do pedido ou não
  public async getByIdAsPrestador(
    idPedido: number,
    idPrestador: number,
    allData = false,
  ): Promise<Pedido> {
    return allData == true
      ? this.repo.findOneOrFail({
          relations: [
            'metodoPagamento',
            'cliente',
            'prestador',
            'situacoes',
            'endereco',
            'servicos',
            'avaliacao',
            'folhasRespostas',
          ],
          where: { id: idPedido, prestador: { id: idPrestador } },
        })
      : this.repo.findOneOrFail({
          where: { id: idPedido, prestador: { id: idPrestador } },
          relations: ['cliente'],
        })
  }

  // Retorna o pedido dado o id do pedido e cliente, os dois devem ser válidos se não retorna erro do próprio método
  // O parâmetro allData dita se vai trazer todas as relações do pedido ou não
  public async getByIdAsCliente(
    idPedido: number,
    idCliente: number,
    allData = false,
  ): Promise<Pedido> {
    return allData == true
      ? this.repo.findOneOrFail({
          relations: [
            'metodoPagamento',
            'cliente',
            'prestador',
            'situacoes',
            'endereco',
            'servicos',
            'avaliacao',
            'folhasRespostas',
          ],
          where: { id: idPedido, cliente: { id: idCliente } },
        })
      : this.repo.findOneOrFail({
          where: { id: idPedido, cliente: { id: idCliente } },
          relations: ['prestador'],
        })
  }

  public async novoPedido(pedido: any): Promise<Pedido> {
    const queryRunner = this.repo.manager.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const folhasRespostas: FolhaResposta[] = []
      if (pedido.folhasRespostas) {
        folhasRespostas.push(...pedido.folhasRespostas)
        delete pedido.folhasRespostas
      }
      const newPedido = await queryRunner.manager.save(Pedido, pedido)
      if (folhasRespostas) {
        const newFolhasResposta = []
        for (const folha of folhasRespostas) {
          folha.pedido = newPedido
          newFolhasResposta.push(folha)
        }
        await queryRunner.manager.save(FolhaResposta, newFolhasResposta)
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()
      return newPedido
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new AllException(TipoErro.ERROR_AO_SALVAR)
    }
  }
}
