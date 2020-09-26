import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { PedidoInterface } from './pedido.interface'
import { MetodoPagamento } from '../metodos-pagamento/metodo-pagamento.entity'
import { Situacao } from '../situacoes/situacao.entity'
import { Endereco } from '../enderecos/endereco.entity'
import { Servico } from '../servicos/servico.entity'
import { JsonHelper } from '../../common/helpers/json.helper'
import { TipoPagamento } from '../metodos-pagamento/metodo-pagamento.interface'

@Entity('pedido')
export class Pedido extends BaseModel<Pedido> implements PedidoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('double precision', { nullable: false })
  subtotal!: number

  @Column('int', { nullable: false, name: 'tipo_pagamento' })
  tipoPagamento!: number

  @Column('text', { nullable: true })
  observacao!: string | null

  @ManyToOne(
    type => MetodoPagamento,
    metodoPagamento => metodoPagamento.pedidos,
    { cascade: false },
  )
  metodoPagamento!: MetodoPagamento

  @OneToMany(
    type => Situacao,
    situacoes => situacoes.pedido,
  )
  situacoes!: Situacao[]

  @ManyToOne(
    type => Endereco,
    endereco => endereco.pedidos,
    { cascade: false },
  )
  endereco!: Endereco

  @ManyToMany(
    type => Servico,
    servicos => servicos.pedidos,
    { cascade: true },
  )
  @JoinTable({ name: 'item' })
  servicos!: Servico[]

  constructor(
    id: number,
    subtotal: number,
    tipoPagamento: number,
    observacao: string | null,
    metodoPagamento: MetodoPagamento,
    situacoes: Situacao[],
    endereco: Endereco,
    servicos: Servico[],
    ativo = true,
  ) {
    super(id, ativo)
    this.subtotal = subtotal
    this.tipoPagamento = tipoPagamento
    this.observacao = observacao
    this.metodoPagamento = metodoPagamento
    this.situacoes = situacoes
    this.endereco = endereco
    this.servicos = servicos
  }

  fillFromJson(json?: any, recursive?: string[] | undefined): Pedido {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.subtotal = json.subtotal
    this.tipoPagamento = json.tipoPagamento
    this.observacao = json.observacao
    this.metodoPagamento = MetodoPagamento.fromJson(json.metodoPagamento)
    this.situacoes = JsonHelper.jsonToArray<Situacao>(
      json.situacoes,
      Situacao.fromJson,
    )
    this.endereco = Endereco.fromJson(json.endereco)
    this.servicos = JsonHelper.jsonToArray<Servico>(
      json.servicos,
      Servico.fromJson,
    )
    this.ativo = json.ativo

    return this
  }

  public static fromJson(json: any): Pedido {
    return new Pedido(
      1,
      1,
      2,
      'df',
      new MetodoPagamento(1, TipoPagamento.cartaoCreditoEntrega, null),
      [],
      new Endereco(1, 'r', 'e', 'r', 'd', 'f', 'f', 'f', 'f'),
      [new Servico(1, 'f', 2, 'r', 'd')],
    ).fillFromJson(json)
  }

  copy(): Pedido {
    const pedido = new Pedido(
      this.id,
      this.subtotal,
      this.tipoPagamento,
      this.observacao,
      this.metodoPagamento,
      this.situacoes,
      this.endereco,
      this.servicos,
      this.ativo,
    )
    pedido.dados = this.dados
    return pedido
  }
}
