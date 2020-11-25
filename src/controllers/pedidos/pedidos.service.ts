import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { Situacao } from '../../models/situacoes/situacao.entity'
import { SituacaoInterface } from '../../models/situacoes/situacao.interface'

@Injectable()
export class PedidosService extends BaseService<Pedido> {
  constructor(@InjectRepository(Pedido) repo: Repository<Pedido>) {
    super(repo)
  }

  public async getPedidosAsCliente(id: number): Promise<Pedido[]> {
    return this.repo.find({
      where: { cliente: { id } },
      relations: ['prestador'],
    })
  }

  public async getPedidosAsPrestador(id: number): Promise<Pedido[]> {
    return this.repo.find({ where: { prestador: { id } } })
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
          ],
          where: { id: idPedido, cliente: { id: idCliente } },
        })
      : this.repo.findOneOrFail({
          where: { id: idPedido, cliente: { id: idCliente } },
          relations: ['prestador'],
        })
  }
}
