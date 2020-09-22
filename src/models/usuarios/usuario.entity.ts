import * as moment from 'moment-timezone'
import { Moment } from 'moment-timezone'
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { TipoStatus, UsuarioInterface } from './usuario.interface'
import { BaseModel } from '../basis/base.entity'
import { Cliente } from '../clientes/cliente.entity'
import { Prestador } from '../prestadores/prestador.entity'

@Entity('usuario')
export class Usuario extends BaseModel<Usuario> implements UsuarioInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  nome!: string

  @Column({ type: 'boolean', nullable: false })
  ativo!: boolean

  @Column('text', { name: 'nome_social', nullable: true })
  nomeSocial!: string | null

  @Column('timestamptz', { nullable: false, name: 'data_nascimento' })
  dataNascimento!: Date

  @Column('text', { nullable: false })
  telefone!: string

  @Column('text', { nullable: false })
  cpf!: string

  @Column('text', { nullable: false, name: 'token_acesso' })
  token!: string

  @Column('int', { nullable: false })
  status!: TipoStatus

  @OneToOne(
    type => Cliente,
    cliente => cliente.usuario,
    { cascade: false },
  )
  cliente!: Cliente

  @OneToOne(
    type => Prestador,
    prestador => prestador.usuario,
    { cascade: false },
  )
  prestador!: Prestador

  constructor(
    id: number,
    status: TipoStatus,
    nome: string,
    nomeSocial: string | null,
    dataNascimento: Moment,
    telefone: string,
    cpf: string,
    token: string,
    ativo = true,
  ) {
    super(id, ativo)
    this.nome = nome
    this.nomeSocial = nomeSocial
    this.dataNascimento = moment(dataNascimento).toDate()
    this.telefone = telefone
    this.cpf = cpf
    this.token = token
    this.status = status
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Usuario {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.cpf = json.cpf as string
    this.dataNascimento = moment(json.dataNascimento)
      .tz(moment.tz.guess())
      .toDate()
    this.nomeSocial = json.nomeSocial as string
    this.nome = json.nome as string
    this.telefone = json.telefone as string
    this.token = json.token as string
    this.status = json.status as TipoStatus
    this.ativo = json.ativo
    return this
  }

  copy(): Usuario {
    const usuario = new Usuario(
      this.id,
      TipoStatus.ativo,
      this.nome,
      this.nomeSocial,
      moment(this.dataNascimento),
      this.telefone,
      this.cpf,
      this.token,
      this.ativo,
    )
    usuario.dados = this.dados
    return usuario
  }

  public static fromJson(json: any): Usuario {
    return new Usuario(
      1,
      TipoStatus.ativo,
      't',
      'a',
      moment(),
      't',
      't',
      '1',
    ).fillFromJson(json)
  }
}
