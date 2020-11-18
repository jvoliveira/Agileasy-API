import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { PedidoInterface } from './pedido.interface'
import { MetodoPagamento } from '../metodos-pagamento/metodo-pagamento.entity'
import { Situacao } from '../situacoes/situacao.entity'
import { Endereco } from '../enderecos/endereco.entity'
import { Moment } from 'moment-timezone'
import * as moment from 'moment-timezone'
import { Servico } from '../servicos/servico.entity'
import { JsonHelper } from '../../common/helpers/json.helper'
import { TipoPagamento } from '../metodos-pagamento/metodo-pagamento.interface'
import { Cliente } from '../clientes/cliente.entity'
import { Prestador } from '../prestadores/prestador.entity'
import { Avaliacao } from '../avaliacao/avaliacao.entity'
import { Cupom } from '../cupons/cupom.entity'

@Entity('pedido')
export class Pedido extends BaseModel<Pedido> implements PedidoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('timestamptz', { nullable: false, name: 'data_hora' })
  dataHora!: Date

  @Column('double precision', { nullable: false })
  subtotal!: number

  @Column('text', { nullable: true })
  observacao!: string | null

  @ManyToOne(
    type => MetodoPagamento,
    metodoPagamento => metodoPagamento.pedidos,
    { cascade: false, eager: true },
  )
  @JoinColumn({ name: 'id_metodo_pagamento' })
  metodoPagamento!: MetodoPagamento

  @ManyToOne(
    type => Cliente,
    cliente => cliente.pedidos,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente

  @ManyToOne(
    type => Prestador,
    prestador => prestador.pedidos,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_prestador' })
  prestador!: Prestador

  @OneToMany(
    type => Situacao,
    situacoes => situacoes.pedido,
    { cascade: true, eager: true },
  )
  situacoes!: Situacao[]

  @ManyToOne(
    type => Cupom,
    cupom => cupom.pedidos,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_cupom' })
  cupom!: Cupom

  @ManyToOne(
    type => Endereco,
    endereco => endereco.pedidos,
    { cascade: false, eager: true },
  )
  @JoinColumn({ name: 'id_endereco' })
  endereco!: Endereco

  @ManyToMany(
    type => Servico,
    servicos => servicos.pedidos,
    { cascade: true, eager: true },
  )
  @JoinTable({
    name: 'item',
    joinColumn: {
      name: 'id_pedido',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_servico',
      referencedColumnName: 'id',
    },
  })
  servicos!: Servico[]

  @OneToOne(
    type => Avaliacao,
    avaliacao => avaliacao.pedido,
    { cascade: true },
  )
  avaliacao: Avaliacao

  constructor(
    id: number,
    subtotal: number,
    observacao: string | null,
    metodoPagamento: MetodoPagamento,
    situacoes: Situacao[],
    endereco: Endereco,
    servicos: Servico[],
    dataHora: Moment,
    ativo = true,
  ) {
    super(id, ativo)
    this.subtotal = subtotal
    this.observacao = observacao
    this.metodoPagamento = metodoPagamento
    this.situacoes = situacoes
    this.endereco = endereco
    this.servicos = servicos
    this.dataHora = moment(dataHora).toDate()
  }

  fillFromJson(json?: any, recursive?: string[] | undefined): Pedido {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.subtotal = json.subtotal
    this.observacao = json.observacao
    this.dataHora = moment(json.dataHora).toDate()
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
      'df',
      new MetodoPagamento(1, TipoPagamento.cartaoCreditoEntrega, null),
      [],
      new Endereco(1, 'r', 'e', 'r', 'd', 'f', 'f', 'f', 'f', 'a', false),
      [new Servico(1, 'f', 2, 'r', 'd')],
      moment(),
    ).fillFromJson(json)
  }

  copy(): Pedido {
    const pedido = new Pedido(
      this.id,
      this.subtotal,
      this.observacao,
      this.metodoPagamento,
      this.situacoes,
      this.endereco,
      this.servicos,
      moment(this.dataHora),
      this.ativo,
    )
    pedido.dados = this.dados
    return pedido
  }
}
