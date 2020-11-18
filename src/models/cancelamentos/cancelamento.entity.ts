import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CancelamentoInterface } from './cancelamento.interface'
import { BaseModel } from '../basis/base.entity'

@Entity('prestador')
export class Cancelamento extends BaseModel<Cancelamento>
  implements CancelamentoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  motivo!: string
  @Column('int', { nullable: false, name: 'tipo_motivo' })
  tipoMotivo!: number
  @Column('int', { nullable: false })
  origem!: number
  @Column('text', { nullable: false })
  consequencia!: string

  constructor(
    id: number,
    motivo: string,
    tipoMotivo: number,
    consequencia: string,
    origem: number,
    ativo = true,
  ) {
    super(id, ativo)
    this.motivo = motivo
    this.tipoMotivo = tipoMotivo
    this.consequencia = consequencia
    this.origem = origem
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Cancelamento {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.origem = json.origem
    this.ativo = json.ativo
    this.motivo = json.motivo
    this.tipoMotivo = json.tipoMotivo
    return this
  }

  copy(): Cancelamento {
    const prestador = new Cancelamento(
      this.id,
      this.motivo,
      this.tipoMotivo,
      this.consequencia,
      this.origem,
      this.ativo,
    )
    prestador.dados = this.dados
    return prestador
  }

  public static fromJson(json: any): Cancelamento {
    const prestador = new Cancelamento(1, 't', 2, 'sa', 1).fillFromJson(json)
    return prestador
  }
}
