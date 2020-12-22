import {
  ManyToMany,
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { ServicoInterface } from './servico.interface'
import { Prestador } from '../prestadores/prestador.entity'
import { Categoria } from '../categorias/categoria.entity'
import { Pedido } from '../pedidos/pedido.entity'
import { VariacaoServico } from '../servico-variacao/variacao-servico.entity'

@Entity('servico')
export class Servico extends BaseModel<Servico> implements ServicoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  descricao!: string

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('double precision', { nullable: false })
  valor!: number

  @Column('text', { nullable: false })
  nome!: string

  @Column('text', { nullable: false, name: 'url_foto' })
  urlFoto!: string

  @ManyToMany(
    type => Pedido,
    pedidos => pedidos.servicos,
    { cascade: false },
  )
  pedidos?: Pedido[]

  @ManyToOne(
    type => Prestador,
    prestador => prestador.servicos,
  )
  @JoinColumn({ name: 'id_prestador' })
  prestador!: Prestador

  @ManyToMany(
    type => Categoria,
    categorias => categorias.servicos,
    { cascade: true },
  )
  categorias?: Categoria[]

  @OneToMany(
    type => VariacaoServico,
    variacoesServico => variacoesServico.servico,
    { cascade: true, eager: true },
  )
  variacoesServico?: VariacaoServico[]

  @Column('double precision', {
    nullable: false,
    name: 'valor_frete',
    default: 0,
  })
  valorFrete: number
  @Column('int', { nullable: false, name: 'tempo_medio', default: 60 })
  tempoMedio: number
  @Column('boolean', {
    nullable: false,
    name: 'no_estabelecimento',
    default: false,
  })
  noEstabelecimento: boolean
  @Column('boolean', { nullable: false, name: 'delivery', default: true })
  delivery: boolean

  constructor(
    id: number,
    descricao: string,
    valor: number,
    nome: string,
    urlFoto: string,
    valorFrete: number,
    tempoMedio: number,
    noEstabelecimento: boolean,
    delivery: boolean,
    ativo = true,
  ) {
    super(id, ativo)
    this.descricao = descricao
    this.valor = valor
    this.nome = nome
    this.urlFoto = urlFoto
    this.valorFrete = valorFrete
    this.tempoMedio = tempoMedio
    this.noEstabelecimento = noEstabelecimento
    this.delivery = delivery
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Servico {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.descricao = json.descricao
    this.valor = json.valor
    this.nome = json.nome
    this.urlFoto = json.urlFoto
    this.ativo = json.ativo
    this.valorFrete = json.valorFrete
    this.tempoMedio = json.tempoMedio
    this.noEstabelecimento = json.noEstabelecimento
    this.delivery = json.delivery
    if (json.variacoesServico != null) {
      this.variacoesServico = (json.variacoesServico as any[]).map(variacao =>
        VariacaoServico.fromJson(variacao),
      )
    }

    return this
  }

  public static fromJson(json: any): Servico {
    return new Servico(1, '', 1, '', '', 1, 1, false, false).fillFromJson(json)
  }

  copy(): Servico {
    const servico = new Servico(
      this.id,
      this.descricao,
      this.valor,
      this.nome,
      this.urlFoto,
      this.valorFrete,
      this.tempoMedio,
      this.noEstabelecimento,
      this.delivery,
      this.ativo,
    )
    servico.dados = this.dados
    return servico
  }
}
