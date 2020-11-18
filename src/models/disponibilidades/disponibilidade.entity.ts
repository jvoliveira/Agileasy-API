import * as moment from 'moment-timezone'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DisponibilidadeInterface } from './disponibilidade.interface'
import { BaseModel } from '../basis/base.entity'
import { Moment } from 'moment-timezone'
import { Prestador } from '../prestadores/prestador.entity'

@Entity('disponibilidade')
export class Disponibilidade extends BaseModel<Disponibilidade>
  implements DisponibilidadeInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int', { nullable: false, name: 'dia_semana' })
  diaSemana: number
  @Column('timestamptz', { nullable: false, name: 'inicio' })
  inicio: Date
  @Column('timestamptz', { nullable: false, name: 'fim' })
  fim: Date
  @Column('boolean', { nullable: false, name: 'excepcional', default: false })
  excepcional: boolean
  @ManyToOne(
    type => Prestador,
    prestador => prestador.disponibilidades,
  )
  @JoinColumn({ name: 'id_prestador' })
  prestador!: Prestador

  constructor(
    id: number,
    excepcional: boolean,
    diaSemana: number,
    inicio: Moment,
    fim: Moment,
    ativo = true,
  ) {
    super(id, ativo)
    this.excepcional = excepcional
    this.diaSemana = diaSemana
    this.inicio = moment(inicio).toDate()
    this.fim = moment(fim).toDate()
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Disponibilidade {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.excepcional = json.excepcional
    this.diaSemana = json.diaSemana
    this.inicio = moment(json.inicio).toDate()
    this.fim = moment(json.fim).toDate()
    this.ativo = json.ativo
    return this
  }

  copy(): Disponibilidade {
    const prestador = new Disponibilidade(
      this.id,
      this.excepcional,
      this.diaSemana,
      moment(this.inicio),
      moment(this.fim),
      this.ativo,
    )
    prestador.dados = this.dados
    return prestador
  }

  public static fromJson(json: any): Disponibilidade {
    const prestador = new Disponibilidade(
      0,
      false,
      1,
      moment(),
      moment(),
    ).fillFromJson(json)
    return prestador
  }
}
