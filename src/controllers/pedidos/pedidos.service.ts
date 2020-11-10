import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/services/base.service'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { SituacaoInterface } from '../../models/situacoes/situacao.interface'

@Injectable()
export class PedidosService extends BaseService<Pedido> {
  constructor(@InjectRepository(Pedido) repo: Repository<Pedido>) {
    super(repo)
  }

  public async getPedidosAsCliente(id: number): Promise<Pedido[]> {
    return this.repo.find({ where: { cliente: { id } } })
  }

  public async getPedidosAsPrestador(id: number): Promise<Pedido[]> {
    return this.repo.find({ where: { prestador: { id } } })
  }

  // Muda para a situação enviada por parâmetro
  public async changeSituacao(
    pedido: Pedido,
    situacao: SituacaoInterface,
  ): Promise<Pedido> {
    pedido.situacoes.push(situacao as any)
    return this.repo.save(pedido)
  }

  // Retorna o pedido dado o id do pedido e prestador, os dois devem ser válidos se não retorna erro do próprio método
  public async getByPedidoAndPrestadorId(
    idPedido: number,
    idPrestador: number,
  ): Promise<Pedido> {
    return this.repo.findOneOrFail({
      where: { id: idPedido, prestador: { id: idPrestador } },
    })
  }
}
