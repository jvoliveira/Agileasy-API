import * as moment from 'moment-timezone'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CupomInterface } from './cupom.interface'
import { BaseModel } from '../basis/base.entity'
import { Moment } from 'moment-timezone'

@Entity('prestador')
export class Cupom extends BaseModel<Cupom> implements CupomInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  codigo!: string
  @Column('double precision', { nullable: false })
  desconto!: number
  @Column('double precision', { nullable: false, name: 'valor_minimo' })
  valorMinimo!: number
  @Column('int', { nullable: false })
  voucher!: number
  @Column('timestamptz', { nullable: false, name: 'validade' })
  validade!: Date
  @Column('int', { nullable: false, name: 'tipo_cupom' })
  tipoCupom!: number
  @Column('boolean', { nullable: false })
  indicacao!: boolean

  constructor(
    id: number,
    indicacao: boolean,
    codigo: string,
    desconto: number,
    valorMinimo: number,
    tipoCupom: number,
    voucher: number,
    validade: Moment,
    ativo = true,
  ) {
    super(id, ativo)
    this.indicacao = indicacao
    this.codigo = codigo
    this.desconto = desconto
    this.valorMinimo = valorMinimo
    this.tipoCupom = tipoCupom
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
    ).fillFromJson(json)
    return prestador
  }
}
