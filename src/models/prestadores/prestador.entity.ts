import * as moment from 'moment-timezone'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm'
import { JsonHelper } from '../../common/helpers/json.helper'
import { Usuario } from '../usuarios/usuario.entity'
import { PrestadorInterface } from './prestador.interface'
import { BaseModel } from '../basis/base.entity'
import { Endereco } from '../enderecos/endereco.entity'
import { Servico } from '../servicos/servico.entity'
import { Categoria } from '../categorias/categoria.entity'
import { TipoStatus } from '../usuarios/usuario.interface'
import { Pedido } from '../pedidos/pedido.entity'
import { Disponibilidade } from '../disponibilidades/disponibilidade.entity'
import { Cupom } from '../cupons/cupom.entity'
import { Informacao } from '../informacao/informacao.entity'

@Entity('prestador')
export class Prestador extends BaseModel<Prestador>
  implements PrestadorInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: true, name: 'url_documento' })
  documentoUrl!: string

  @Column('int', { nullable: false, name: 'tipo_pessoa' })
  tipoPessoa!: number

  @Column('int', { nullable: false, name: 'taxa', default: 10 })
  taxa!: number

  @Column('text', { nullable: true })
  cnpj!: string | null

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('text', { nullable: true, name: 'razao_social' })
  razaoSocial!: string | null

  @Column('text', { nullable: false, name: 'nome_publico' })
  nomePublico!: string

  @ManyToMany(
    type => Cupom,
    cuponsDisponiveis => cuponsDisponiveis.prestadores,
    { cascade: false },
  )
  cuponsDisponiveis?: Cupom[]

  @Column('double precision', { nullable: false, name: 'nota', default: 0 })
  nota!: number

  @Column('text', { nullable: true, name: 'token_notificacao' })
  tokenNotificacao!: string

  @Column('text', { nullable: true, name: 'capa' })
  capa!: string

  @Column('text', { nullable: true })
  logo!: string

  @Column('text', {
    nullable: true,
    name: 'cidades_atua',
    array: true,
  })
  cidadesAtua!: string[]

  @Column('boolean', { nullable: false })
  delivery!: boolean

  @Column('timestamptz', { nullable: false, name: 'criado_em' })
  criadoEm!: Date

  @OneToMany(
    type => Pedido,
    pedidos => pedidos.prestador,
  )
  pedidos!: Pedido[]

  @OneToOne(
    type => Usuario,
    usuario => usuario.prestador,
    { cascade: true, eager: true },
  )
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario

  @OneToOne(
    type => Informacao,
    informacao => informacao.prestador,
    { cascade: false, eager: false, nullable: true },
  )
  informacao!: Informacao

  @OneToOne(
    type => Endereco,
    endereco => endereco.prestador,
    { cascade: true },
  )
  @JoinColumn({ name: 'id_endereco' })
  endereco!: Endereco

  @OneToMany(
    type => Disponibilidade,
    disponibilidades => disponibilidades.prestador,
    { cascade: true },
  )
  disponibilidades!: Disponibilidade[]

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
  @JoinTable({
    name: 'categoria_prestador',
    joinColumn: {
      name: 'id_prestador',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_categoria',
      referencedColumnName: 'id',
    },
  })
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
    logo: string,
    nota: number,
    capa: string,
    cidadesAtua: string[],
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
    this.logo = logo
    this.cidadesAtua = cidadesAtua
    this.endereco = endereco
    this.servicos = servicos
    this.categorias = categorias
    this.nota = nota
    this.capa = capa
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
    this.cidadesAtua = json.cidadesAtua
    this.logo = json.logo
    this.nota = json.nota
    this.capa = json.capa
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
      this.logo,
      this.nota,
      this.capa,
      this.cidadesAtua,
      this.ativo,
    )
    prestador.dados = this.dados
    return prestador
  }

  public static fromJson(json: any): Prestador {
    const prestador = new Prestador(
      0,
      new Usuario(
        1,
        TipoStatus.ativo,
        'a',
        'a',
        moment(),
        'a',
        'a',
        'a',
        '1',
        '1',
        'a',
        'a',
      ),
      '2',
      true,
      't',
      't',
      'r',
      3,
      new Endereco(1, 'r', 'e', 'r', 'd', 'f', 'f', 'f', 'f', 'a', false),
      [],
      [],
      '1',
      4.5,
      'a',
      [],
    ).fillFromJson(json)
    return prestador
  }
}
