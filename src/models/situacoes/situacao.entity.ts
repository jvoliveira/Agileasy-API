import * as moment from 'moment-timezone'
import { Moment } from 'moment-timezone'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { SituacaoInterface, Estado } from './situacao.interface'
import { BaseModel } from '../basis/base.entity'
import { Pedido } from '../pedidos/pedido.entity'

@Entity('situacao')
export class Situacao extends BaseModel<Situacao> implements SituacaoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('int', { nullable: false })
  estado!: Estado

  @Column('timestamptz', { nullable: false })
  data!: Date

  @ManyToOne(
    type => Pedido,
    pedido => pedido.situacoes,
    { cascade: false },
  )
  pedido!: Pedido

  constructor(id: number, estado: Estado, data: Moment, ativo = true) {
    super(id, ativo)
    this.estado = estado
    this.data = moment(data).toDate()
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Situacao {
    if (!json) {
      json = this.dados
    }
    this.estado = json.estado as Estado
    this.id = json.id
    this.data = moment(json.data).toDate()
    this.ativo = json.ativo

    return this
  }

  public static fromJson(json: any): Situacao {
    return new Situacao(1, Estado.aceito, moment()).fillFromJson(json)
  }

  copy(): Situacao {
    const situacao = new Situacao(
      this.id,
      this.estado,
      moment(this.data),
      this.ativo,
    )
    situacao.dados = this.dados
    return situacao
  }
}
