import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { Pedido } from '../pedidos/pedido.entity'
import { AvaliacaoInterface } from './avaliacao.interface'

@Entity('avaliacao')
export class Avaliacao extends BaseModel<Avaliacao>
  implements AvaliacaoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  comentario: string

  @Column('double precision', { nullable: false })
  nota: number

  @Column('text', { nullable: false })
  urlFoto: string

  @Column('int', { nullable: false })
  quemAvaliou: number

  @ManyToOne(
    type => Pedido,
    pedido => pedido.avaliacoes,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido

  constructor(
    id: number,
    comentario: string,
    nota: number,
    urlFoto: string,
    quemAvaliou: number,
  ) {
    super(id, true)
    this.id = id
    this.comentario = comentario
    this.nota = nota
    this.urlFoto = urlFoto
    this.quemAvaliou = quemAvaliou
  }

  fillFromJson(json: any, recursive?: string[]): Avaliacao {
    this.id = json['id']
    this.comentario = json['comentario']
    this.nota = json['nota']
    this.urlFoto = json['urlFoto']
    this.quemAvaliou = json['quemAvaliou']

    return this
  }

  public static fromJson(json: any): Avaliacao {
    return new Avaliacao(1, '', 5, '', 1).fillFromJson(json)
  }

  copy(): Avaliacao {
    return new Avaliacao(
      this.id,
      this.comentario,
      this.nota,
      this.urlFoto,
      this.quemAvaliou,
    )
  }
}
