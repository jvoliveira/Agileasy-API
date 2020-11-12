import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { EnderecoInterface } from './endereco.interface'
import { Prestador } from '../prestadores/prestador.entity'
import { Cliente } from '../clientes/cliente.entity'
import { Pedido } from '../pedidos/pedido.entity'

@Entity('endereco')
export class Endereco extends BaseModel<Endereco> implements EnderecoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('text', { nullable: false })
  apelido!: string

  @Column('text', { nullable: false })
  endereco!: string

  @Column('text', { nullable: true })
  complemento: string | null

  @Column('text', { nullable: false })
  numero!: string

  @Column('text', { nullable: false })
  cidade!: string

  @Column('text', { nullable: false })
  estado!: string

  @Column('text', { nullable: false })
  cep!: string

  @Column('text', { nullable: true })
  referencia: string | null

  @Column('boolean', { nullable: false, default: false })
  favorito: boolean

  @ManyToOne(
    type => Cliente,
    cliente => cliente.enderecos,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente

  @OneToMany(
    type => Pedido,
    pedido => pedido.endereco,
    { cascade: false },
  )
  pedidos?: Pedido[]

  @OneToOne(
    type => Prestador,
    prestador => prestador.endereco,
    { cascade: false },
  )
  prestador?: Prestador

  constructor(
    id: number,
    apelido: string,
    endereco: string,
    complemento: string | null,
    numero: string,
    cidade: string,
    estado: string,
    cep: string,
    referencia: string | null,
    favorito: boolean,
    ativo = true,
  ) {
    super(id, ativo)
    this.apelido = apelido
    this.endereco = endereco
    this.complemento = complemento
    this.numero = numero
    this.cidade = cidade
    this.estado = estado
    this.cep = cep
    this.referencia = referencia
    this.favorito = favorito
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Endereco {
    this.id = json.id
    this.apelido = json.apelido
    this.endereco = json.endereco
    this.complemento = json.complemento
    this.numero = json.numero
    this.cidade = json.cidade
    this.estado = json.estado
    this.cep = json.cep
    this.referencia = json.referencia
    this.ativo = json.ativo
    this.favorito = json.favorito
    return this
  }

  public static fromJson(json: any): Endereco {
    return new Endereco(
      1,
      'f',
      'f',
      'd',
      'd',
      'd',
      'd',
      'd',
      'd',
      false,
    ).fillFromJson(json)
  }

  copy(): Endereco {
    const endereco = new Endereco(
      this.id,
      this.apelido,
      this.endereco,
      this.complemento,
      this.numero,
      this.cidade,
      this.estado,
      this.cep,
      this.referencia,
      this.favorito,
      this.ativo,
    )
    endereco.dados = this.dados
    return endereco
  }
}
