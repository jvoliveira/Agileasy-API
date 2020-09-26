import {
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm'
import { Prestador } from '../prestadores/prestador.entity'
import { Servico } from '../servicos/servico.entity'
import { BaseModel } from '../basis/base.entity'
import { CategoriaInterface } from './categoria.interface'

@Entity('categoria')
export class Categoria extends BaseModel<Categoria>
  implements CategoriaInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @OneToOne(
    type => Categoria,
    catPai => catPai.catPai,
    { cascade: false },
  )
  @JoinColumn()
  catPai: Categoria | null

  @Column('text', { nullable: false })
  descricao!: string

  @ManyToMany(
    type => Prestador,
    prestador => prestador.categorias,
    { cascade: false },
  )
  @JoinTable({ name: 'categoria_prestador' })
  prestadores?: Prestador[]

  @ManyToMany(
    type => Servico,
    servicos => servicos.categorias,
    { cascade: false },
  )
  @JoinTable({ name: 'categoria_servico' })
  servicos?: Servico[]

  constructor(
    id: number,
    catPai: Categoria | null,
    descricao: string,
    ativo = true,
  ) {
    super(id, ativo)
    this.catPai = catPai
    this.descricao = descricao
  }

  public static fromJson(json: any): Categoria {
    return new Categoria(1, null, 'd').fillFromJson(json)
  }

  fillFromJson(json?: any, recursive?: string[] | undefined): Categoria {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.catPai = json.catPai == null ? null : Categoria.fromJson(json.catPai)
    this.descricao = json.descricao as string
    this.ativo = json.ativo
    return this
  }

  copy(): Categoria {
    const categoria = new Categoria(
      this.id,
      this.catPai,
      this.descricao,
      this.ativo,
    )
    categoria.dados = this.dados
    return categoria
  }
}
