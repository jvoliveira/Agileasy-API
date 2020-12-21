import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { FolhaResposta } from '../folha-resposta/folha-resposta.entity'
import { VariacaoServico } from '../servico-variacao/variacao-servico.entity'
import { AlternativaInterface } from './alternativa.interface'

@Entity('alternativa')
export class Alternativa extends BaseModel<Alternativa>
  implements AlternativaInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: true })
  descricao: string

  @Column('text', { nullable: true })
  titulo: string

  @Column('double precision', { nullable: false, default: 0 })
  valor: number

  @ManyToOne(
    type => VariacaoServico,
    variacaoServico => variacaoServico.alternativas,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_variacao' })
  variacaoServico: VariacaoServico

  @OneToMany(
    type => FolhaResposta,
    folhasRespostas => folhasRespostas.alternativa,
    { cascade: false },
  )
  folhasRespostas?: FolhaResposta[]

  constructor(id: number, descricao: string) {
    super(id, true)
    this.descricao = descricao
  }

  fillFromJson(json: any, recursive?: string[]): Alternativa {
    this.id = json['id']
    this.descricao = json['descricao']

    return this
  }

  public static fromJson(json: any): Alternativa {
    return new Alternativa(1, '').fillFromJson(json)
  }

  copy(): Alternativa {
    return new Alternativa(this.id, this.descricao)
  }
}
