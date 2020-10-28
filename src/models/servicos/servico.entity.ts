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
import { Alternativa } from '../alternativa/alternativa.entity'

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
    { cascade: false },
  )
  categorias?: Categoria[]

  @OneToMany(
    type => VariacaoServico,
    variacao => variacao.servico,
    { cascade: true },
  )
  variacao: VariacaoServico

  constructor(
    id: number,
    descricao: string,
    valor: number,
    nome: string,
    urlFoto: string,
    ativo = true,
    variacao: VariacaoServico,
  ) {
    super(id, ativo)
    this.descricao = descricao
    this.valor = valor
    this.nome = nome
    this.urlFoto = urlFoto
    this.variacao = variacao
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
    this.variacao = VariacaoServico.fromJson(json.variacao)

    return this
  }

  public static fromJson(json: any): Servico {
    return new Servico(
      1,
      '',
      1,
      '',
      '',
      true,
      new VariacaoServico(1, 1, 'Escolha o modelo', true, 1, 1, [
        new Alternativa(1, 'ALTERNATIVA 1', 1),
      ]),
    ).fillFromJson(json)
  }

  copy(): Servico {
    const servico = new Servico(
      this.id,
      this.descricao,
      this.valor,
      this.nome,
      this.urlFoto,
      this.ativo,
      this.variacao,
    )
    servico.dados = this.dados
    return servico
  }
}
