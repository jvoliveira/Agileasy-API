import * as moment from 'moment-timezone'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { CupomInterface } from './cupom.interface'
import { BaseModel } from '../basis/base.entity'
import { Moment } from 'moment-timezone'
import { Cliente } from '../clientes/cliente.entity'
import { Pedido } from '../pedidos/pedido.entity'
import { Prestador } from '../prestadores/prestador.entity'

@Entity('cupom')
export class Cupom extends BaseModel<Cupom> implements CupomInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('text', { nullable: false })
  codigo!: string
  @Column('double precision', { nullable: false })
  desconto!: number
  @Column('double precision', { nullable: false, name: 'valor_minimo' })
  valorMinimo!: number
  @Column('double precision', { nullable: false, name: 'valor_maximo' })
  valorMaximo!: number
  @Column('int', { nullable: false, default: 0 })
  voucher!: number
  @Column('timestamptz', { nullable: false, name: 'validade' })
  validade!: Date
  @Column('int', { nullable: false, name: 'tipo_cupom' })
  tipoCupom!: number
  @Column('int', { nullable: false, name: 'tipo_desconto' })
  tipoDesconto!: number
  @Column('int', { nullable: false, name: 'quantidade_maxima' })
  quantidadeMaxima!: number
  @Column('int', { nullable: false, name: 'restantes' })
  restantes!: number
  @Column('boolean', { nullable: false, default: false })
  indicacao!: boolean
  @ManyToMany(
    type => Cliente,
    clientesPermitidos => clientesPermitidos.cuponsDisponiveis,
    { cascade: false },
  )
  @JoinTable({
    name: 'cupom_cliente',
    joinColumn: {
      name: 'id_cupom',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_cliente',
      referencedColumnName: 'id',
    },
  })
  clientesPermitidos?: Cliente[]

  @ManyToMany(
    type => Prestador,
    prestadores => prestadores.cuponsDisponiveis,
    { cascade: false },
  )
  @JoinTable({
    name: 'cupom_prestador',
    joinColumn: {
      name: 'id_cupom',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_prestador',
      referencedColumnName: 'id',
    },
  })
  prestadores?: Prestador[]

  @OneToOne(
    type => Cliente,
    cliente => cliente.cupomIndicacao,
  )
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente

  @OneToMany(
    type => Pedido,
    pedidos => pedidos.cupom,
    { cascade: false },
  )
  pedidos!: Pedido[]

  constructor(
    id: number,
    indicacao: boolean,
    codigo: string,
    desconto: number,
    valorMinimo: number,
    tipoCupom: number,
    voucher: number,
    validade: Moment,
    tipoDesconto: number,
    ativo = true,
  ) {
    super(id, ativo)
    this.indicacao = indicacao
    this.codigo = codigo
    this.desconto = desconto
    this.valorMinimo = valorMinimo
    this.tipoCupom = tipoCupom
    this.tipoDesconto = tipoDesconto
    this.voucher = voucher
    this.validade = moment(validade).toDate()
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Cupom {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.indicacao = json.indicacao
    this.voucher = json.voucher
    this.validade = moment(json.validade).toDate()
    this.ativo = json.ativo
    this.codigo = json.codigo
    this.desconto = json.desconto
    this.valorMinimo = json.valorMinimo
    this.tipoDesconto = json.tipoDesconto
    return this
  }

  copy(): Cupom {
    const prestador = new Cupom(
      this.id,
      this.indicacao,
      this.codigo,
      this.desconto,
      this.valorMinimo,
      this.tipoCupom,
      this.voucher,
      moment(this.validade),
      this.tipoDesconto,
      this.ativo,
    )
    prestador.dados = this.dados
    return prestador
  }

  public static fromJson(json: any): Cupom {
    const prestador = new Cupom(
      1,
      false,
      't',
      1,
      2,
      2,
      1,
      moment(),
      1,
    ).fillFromJson(json)
    return prestador
  }
}
