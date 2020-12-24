import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Alternativa } from '../alternativa/alternativa.entity'
import { BaseModel } from '../basis/base.entity'
import { Pedido } from '../pedidos/pedido.entity'
import { FolhaRespostaInterface } from './folha-resposta.interface'

@Entity('folha_resposta')
export class FolhaResposta extends BaseModel<FolhaResposta>
  implements FolhaRespostaInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int', { nullable: false, default: 0 })
  quantidade!: number

  @ManyToOne(
    type => Pedido,
    pedido => pedido.folhasRespostas,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_pedido' })
  pedido?: Pedido

  @ManyToOne(
    type => Alternativa,
    alternativa => alternativa.folhasRespostas,
    { cascade: false, eager: true },
  )
  @JoinColumn({ name: 'id_alternativa' })
  alternativa?: Alternativa

  constructor(id: number, ativo = true) {
    super(id, ativo)
  }

  fillFromJson(json: any, recursive?: string[] | undefined): FolhaResposta {
    this.id = json.id
    if (json.alternativa) {
      this.alternativa = Alternativa.fromJson(json.alternativa)
    }
    if (json.pedido) {
      this.pedido = Pedido.fromJson(json.pedido)
    }
    this.ativo = json.ativo
    return this
  }

  public static fromJson(json: any): FolhaResposta {
    return new FolhaResposta(1, false).fillFromJson(json)
  }

  copy(): FolhaResposta {
    const endereco = new FolhaResposta(this.id, this.ativo)
    return endereco
  }
}
