import {
  MPagamentoInterface,
  TipoPagamento,
} from './metodo-pagamento.interface'
import { Cartao } from '../cartoes/cartao.entity'
import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { Pedido } from '../pedidos/pedido.entity'

@Entity('metodo_pagamento')
export class MetodoPagamento extends BaseModel<MetodoPagamento>
  implements MPagamentoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('int', { nullable: false, name: 'tipo_pagamento' })
  tipoPagamento!: TipoPagamento

  @ManyToOne(
    type => Cartao,
    cartao => cartao.metodosPagamentos,
    { cascade: true },
  )
  @JoinColumn({ name: 'id_cartao' })
  cartao!: Cartao | null

  @OneToMany(
    type => Pedido,
    pedidos => pedidos.metodoPagamento,
  )
  pedidos!: Pedido[]

  constructor(
    id: number,
    tipoPagamento: TipoPagamento,
    cartao: Cartao | null,
    ativo = true,
  ) {
    super(id, ativo)
    this.tipoPagamento = tipoPagamento
    this.cartao = cartao
  }

  fillFromJson(json: any, recursive?: string[] | undefined): MetodoPagamento {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.tipoPagamento = json.tipoPagamento
    this.cartao = Cartao.fromJson(json.cartao)
    this.ativo = json.ativo
    return this
  }

  public static fromJson(json: any): MetodoPagamento {
    return new MetodoPagamento(
      1,
      TipoPagamento.cartaoCreditoEntrega,
      null,
    ).fillFromJson(json)
  }

  copy(): MetodoPagamento {
    const mpagamento = new MetodoPagamento(
      this.id,
      this.tipoPagamento,
      this.cartao,
      this.ativo,
    )
    mpagamento.dados = this.dados

    return mpagamento
  }
}
