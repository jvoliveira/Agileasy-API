import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { VariacaoServicoInterface } from './variacao-servico.interface'
import { JsonHelper } from '../../common/helpers/json.helper'
import { Alternativa } from '../alternativa/alternativa.entity'

@Entity('variacaoServico')
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

  @Column('int', { nullable: false })
  id_servico: number

  @Column('int', { nullable: false })
  qtsMaxima: number

  @Column('int', { nullable: false })
  alternativas: Alternativa[]

  constructor(
    id: number,
    tipo: number,
    titulo: string,
    obrigatorio: boolean,
    id_servico: number,
    qtsMaxima: number,
    alternativas: Alternativa[],
  ) {
    super(id, true)
    this.id = id
    this.tipo = tipo
    this.titulo = titulo
    this.obrigatorio = obrigatorio
    this.id_servico = id_servico
    this.qtsMaxima = qtsMaxima
    this.alternativas = alternativas
  }

  fillFromJson(json: any, recursive?: string[]): VariacaoServico {
    this.id = json['id']
    this.tipo = json['tipo']
    this.titulo = json['titulo']
    this.obrigatorio = json['obrigatorio']
    this.id_servico = json['id_servico']
    this.qtsMaxima = json['qtsMaxima']
    this.alternativas = JsonHelper.jsonToArray<Alternativa>(
      json['alternativas'],
      Alternativa.fromJson,
    )

    return this
  }

  public static fromJson(json: any): VariacaoServico {
    return new VariacaoServico(1, 1, '', true, 1, 1, [
      new Alternativa(1, 'ALTERNATIVA 1', 1),
    ]).fillFromJson(json)
  }

  copy(): VariacaoServico {
    return new VariacaoServico(
      this.id,
      this.tipo,
      this.titulo,
      this.obrigatorio,
      this.id_servico,
      this.qtsMaxima,
      this.alternativas,
    )
  }
}
