import { Endereco } from '../enderecos/endereco.entity'
import * as moment from 'moment-timezone'
import {
  PrimaryGeneratedColumn,
  OneToMany,
  Entity,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { Usuario } from '../usuarios/usuario.entity'
import { ClienteInterface } from './cliente.interface'
import { JsonHelper } from '../../common/helpers/json.helper'
import { TipoStatus } from '../usuarios/usuario.interface'
import { Cartao } from '../cartoes/cartao.entity'
import { Pedido } from '../pedidos/pedido.entity'

@Entity('cliente')
export class Cliente extends BaseModel<Cliente> implements ClienteInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @OneToOne(
    type => Usuario,
    usuario => usuario.cliente,
    { cascade: true, eager: true },
  )
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario

  @OneToMany(
    type => Endereco,
    enderecos => enderecos.cliente,
    { cascade: true },
  )
  enderecos!: Endereco[]

  @OneToMany(
    type => Pedido,
    pedidos => pedidos.cliente,
  )
  pedidos!: Pedido[]

  @OneToMany(
    type => Cartao,
    cartoes => cartoes.cliente,
    { cascade: true },
  )
  cartoes!: Cartao[]

  constructor(
    id: number,
    usuario: Usuario,
    enderecos: Endereco[],
    cartoes: Cartao[],
    ativo = true,
  ) {
    super(id, ativo)
    this.usuario = usuario
    this.enderecos = enderecos
    this.cartoes = cartoes
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Cliente {
    if (!json) {
      json = this.dados
    }
    this.usuario = Usuario.fromJson(json.usuario)
    this.id = json.id
    this.enderecos = JsonHelper.jsonToArray<Endereco>(
      json.enderecos,
      Endereco.fromJson,
    )
    this.cartoes = JsonHelper.jsonToArray<Cartao>(json.cartoes, Cartao.fromJson)
    this.ativo = json.ativo
    return this
  }

  copy(): Cliente {
    const cliente = new Cliente(
      this.id,
      this.usuario,
      this.enderecos,
      this.cartoes,
      this.ativo,
    )
    cliente.dados = this.dados
    return cliente
  }

  public static fromJson(json: any): Cliente {
    return new Cliente(
      0,
      new Usuario(1, TipoStatus.ativo, 'a', 'a', moment(), 'a', 'a', 'a', 'a'),
      [],
      [],
    ).fillFromJson(json)
  }
}
