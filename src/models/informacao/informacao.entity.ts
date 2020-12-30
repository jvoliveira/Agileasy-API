import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { Portfolio } from '../portfolio/portfolio.entity'
import { Prestador } from '../prestadores/prestador.entity'
import { InformacaoInterface } from './informacao.interface'

@Entity('portfolio')
export class Informacao extends BaseModel<Informacao>
  implements InformacaoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column('text', { nullable: true })
  descricao!: string

  @Column('text', { nullable: true })
  instagram: string

  @Column('text', { nullable: true })
  site!: string

  @Column('text', { nullable: true })
  facebook!: string

  @OneToOne(
    type => Prestador,
    prestador => prestador.informacao,
    { cascade: false, eager: false },
  )
  prestador!: Prestador

  @OneToMany(
    type => Portfolio,
    portfolio => portfolio.informacao,
    { cascade: true },
  )
  portfolios: Portfolio[]

  constructor(
    id: number,
    descricao: string,
    instagram: string,
    facebook: string,
    site: string,
    ativo = true,
  ) {
    super(id, ativo)
    this.descricao = descricao
    this.facebook = facebook
    this.instagram = instagram
    this.site = site
  }

  fillFromJson(json: any, recursive?: string[]): Informacao {
    this.id = json['id']
    this.descricao = json['descricao']
    this.ativo = json['ativo']
    this.instagram = json['instagram']
    this.facebook = json['facebook']
    this.site = json['site']
    return this
  }

  public static fromJson(json: any): Informacao {
    return new Informacao(1, '', '', '', '').fillFromJson(json)
  }

  copy(): Informacao {
    return new Informacao(
      this.id,
      this.descricao,
      this.instagram,
      this.facebook,
      this.site,
      this.ativo,
    )
  }
}
