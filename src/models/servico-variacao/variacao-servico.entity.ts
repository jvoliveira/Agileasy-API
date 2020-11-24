import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { VariacaoServicoInterface } from './variacao-servico.interface'
import { JsonHelper } from '../../common/helpers/json.helper'
import { Alternativa } from '../alternativa/alternativa.entity'
import { Servico } from '../servicos/servico.entity'

@Entity('variacao_servico')
export class VariacaoServico extends BaseModel<VariacaoServico>
  implements VariacaoServicoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int', { nullable: false })
  tipo: number

  @Column('text', { nullable: false })
  titulo: string

  @Column('boolean', { nullable: false })
  obrigatorio: boolean

  @Column('int', { nullable: false, name: 'quantidade_maxima' })
  qtsMaxima: number

  @OneToMany(
    type => Alternativa,
    alternativas => alternativas.variacaoServico,
    {
      cascade: true,
    },
  )
  alternativas: Alternativa[]

  @ManyToOne(
    type => Servico,
    servico => servico.variacoesServico,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_servico' })
  servico: Servico

  constructor(
    id: number,
    tipo: number,
    titulo: string,
    obrigatorio: boolean,
    qtsMaxima: number,
    ativo = true,
  ) {
    super(id, ativo)
    this.id = id
    this.tipo = tipo
    this.titulo = titulo
    this.obrigatorio = obrigatorio
    this.qtsMaxima = qtsMaxima
  }

  fillFromJson(json: any, recursive?: string[]): VariacaoServico {
    this.id = json['id']
    this.tipo = json['tipo']
    this.titulo = json['titulo']
    this.obrigatorio = json['obrigatorio']
    this.qtsMaxima = json['qtsMaxima']
    this.alternativas = JsonHelper.jsonToArray<Alternativa>(
      json['alternativas'],
      Alternativa.fromJson,
    )

    return this
  }

  public static fromJson(json: any): VariacaoServico {
    return new VariacaoServico(1, 1, '', true, 1).fillFromJson(json)
  }

  copy(): VariacaoServico {
    return new VariacaoServico(
      this.id,
      this.tipo,
      this.titulo,
      this.obrigatorio,
      this.qtsMaxima,
    )
  }
}
