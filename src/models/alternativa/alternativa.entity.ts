import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { AlternativaInterface } from './alternativa.interface'

@Entity('alternativa')
export class Alternativa extends BaseModel<Alternativa>
  implements AlternativaInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  descricao: string

  @Column('int', { nullable: false })
  idVariacao: number

  constructor(id: number, descricao: string, idVariacao: number) {
    super(id, true)
    this.descricao = descricao
    this.idVariacao = idVariacao
  }

  fillFromJson(json: any, recursive?: string[]): Alternativa {
    this.id = json['id']
    this.descricao = json['descricao']
    this.idVariacao = json['idVariacao']

    return this
  }

  public static fromJson(json: any): Alternativa {
    return new Alternativa(1, '', 1).fillFromJson(json)
  }

  copy(): Alternativa {
    return new Alternativa(this.id, this.descricao, this.idVariacao)
  }
}
