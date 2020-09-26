import * as moment from 'moment-timezone'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm'
import { JsonHelper } from '../../common/helpers/json.helper'
import { Usuario } from '../usuarios/usuario.entity'
import { PrestadorInterface } from './prestador.interface'
import { BaseModel } from '../basis/base.entity'
import { Endereco } from '../enderecos/endereco.entity'
import { Servico } from '../servicos/servico.entity'
import { Categoria } from '../categorias/categoria.entity'
import { TipoStatus } from '../usuarios/usuario.interface'

@Entity('prestador')
export class Prestador extends BaseModel<Prestador>
  implements PrestadorInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false, name: 'url_documento' })
  documentoUrl!: string

  @Column('int', { nullable: false, name: 'tipo_pessoa' })
  tipoPessoa!: number

  @Column('text', { nullable: true })
  cnpj!: string | null

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('text', { nullable: true, name: 'razao_social' })
  razaoSocial!: string | null

  @Column('text', { nullable: false, name: 'nome_publico' })
  nomePublico!: string

  @Column('boolean', { nullable: false })
  delivery!: boolean

  @OneToOne(
    type => Usuario,
    usuario => usuario.prestador,
    { cascade: true, eager: true },
  )
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario

  @OneToOne(
    type => Endereco,
    endereco => endereco.prestador,
    { cascade: true },
  )
  @JoinColumn({ name: 'id_endereco' })
  endereco!: Endereco

  @OneToMany(
    type => Servico,
    servicos => servicos.prestador,
    { cascade: true },
  )
  servicos!: Servico[]

  @ManyToMany(
    type => Categoria,
    categorias => categorias.prestadores,
    { cascade: false },
  )
  categorias!: Categoria[]

  constructor(
    id: number,
    usuario: Usuario,
    cnpj: string | null,
    delivery: boolean,
    documentoUrl: string,
    nomePublico: string,
    razaoSocial: string | null,
    tipoPessoa: number,
    endereco: Endereco,
    servicos: Servico[],
    categorias: Categoria[],
    ativo = true,
  ) {
    super(id, ativo)
    this.usuario = usuario
    this.cnpj = cnpj
    this.delivery = delivery
    this.documentoUrl = documentoUrl
    this.nomePublico = nomePublico
    this.razaoSocial = razaoSocial
    this.tipoPessoa = tipoPessoa
    this.endereco = endereco
    this.servicos = servicos
    this.categorias = categorias
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Prestador {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.usuario = Usuario.fromJson(json.usuario)
    this.cnpj = json.cnpj
    this.delivery = json.delivery
    this.documentoUrl = json.documentoUrl
    this.nomePublico = json.nomePublico
    this.razaoSocial = json.razaoSocial
    this.tipoPessoa = json.tipoPessoa
    this.endereco = Endereco.fromJson(json.endereco)
    this.servicos = JsonHelper.jsonToArray<Servico>(
      json.servicos,
      Servico.fromJson,
    )
    this.categorias = JsonHelper.jsonToArray<Categoria>(
      json.categorias,
      Categoria.fromJson,
    )
    this.ativo = json.ativo
    return this
  }

  copy(): Prestador {
    const prestador = new Prestador(
      this.id,
      this.usuario,
      this.cnpj,
      this.delivery,
      this.documentoUrl,
      this.nomePublico,
      this.razaoSocial,
      this.tipoPessoa,
      this.endereco,
      this.servicos,
      this.categorias,
      this.ativo,
    )
    prestador.dados = this.dados
    return prestador
  }

  public static fromJson(json: any): Prestador {
    const prestador = new Prestador(
      0,
      new Usuario(1, TipoStatus.ativo, 'a', 'a', moment(), 'a', 'a', 'a'),
      '2',
      true,
      't',
      't',
      'r',
      3,
      new Endereco(1, 'r', 'e', 'r', 'd', 'f', 'f', 'f', 'f'),
      [],
      [],
    ).fillFromJson(json)
    return prestador
  }
}
