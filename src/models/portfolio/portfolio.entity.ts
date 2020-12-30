import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { Informacao } from '../informacao/informacao.entity'
import { PortfolioInterface } from './portfolio.interface'

@Entity('portfolio')
export class Portfolio extends BaseModel<Portfolio>
  implements PortfolioInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('text', { nullable: true })
  descricao!: string

  @Column('text', { nullable: false })
  url: string

  @Column('int', { nullable: false, default: 0 })
  posicao!: number

  @ManyToOne(
    type => Informacao,
    informacao => informacao.portfolios,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_informacao' })
  informacao: Informacao

  constructor(
    id: number,
    descricao: string,
    url: string,
    posicao: number,
    ativo = true,
  ) {
    super(id, ativo)
    this.descricao = descricao
    this.url = url
    this.posicao = posicao
  }

  fillFromJson(json: any, recursive?: string[]): Portfolio {
    this.id = json['id']
    this.descricao = json['descricao']
    this.ativo = json['ativo']
    this.url = json['url']
    this.posicao = json['posicao']
    return this
  }

  public static fromJson(json: any): Portfolio {
    return new Portfolio(1, '', '', 0).fillFromJson(json)
  }

  copy(): Portfolio {
    return new Portfolio(
      this.id,
      this.descricao,
      this.url,
      this.posicao,
      this.ativo,
    )
  }
}
