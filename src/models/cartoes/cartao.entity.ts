import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BaseModel } from '../basis/base.entity'
import { CartaoInterface } from './cartao.interface'
import { MetodoPagamento } from '../metodos-pagamento/metodo-pagamento.entity'
import { Cliente } from '../clientes/cliente.entity'

@Entity('cartao')
export class Cartao extends BaseModel<Cartao> implements CartaoInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo!: boolean

  @Column({ type: 'text', nullable: false })
  numero!: string

  @Column({ type: 'text', nullable: false })
  bandeira!: string

  @Column({ type: 'text', nullable: false })
  cvv!: string

  @Column({ type: 'text', nullable: false })
  nome!: string

  @Column({ type: 'text', nullable: false })
  mes!: string

  @Column({ type: 'text', nullable: false })
  ano!: string

  @Column({ type: 'text', nullable: false })
  token!: string

  @Column({ type: 'text', nullable: false })
  cpf!: string

  @OneToMany(
    type => MetodoPagamento,
    metodoPagamento => metodoPagamento.cartao,
  )
  metodosPagamentos?: MetodoPagamento[]

  @ManyToOne(
    type => Cliente,
    cliente => cliente.cartoes,
    { cascade: false },
  )
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente

  constructor(
    id: number,
    numero: string,
    mes: string,
    ano: string,
    token: string,
    cpf: string,
    bandeira: string,
    cvv: string,
    nome: string,
    ativo = true,
  ) {
    super(id, ativo)
    this.numero = numero
    this.mes = mes
    this.ano = ano
    this.bandeira = bandeira
    this.cvv = cvv
    this.token = token
    this.nome = nome
    this.cpf = cpf
  }

  fillFromJson(json: any, recursive?: string[] | undefined): Cartao {
    if (!json) {
      json = this.dados
    }
    this.id = json.id
    this.numero = json.numero
    this.mes = json.mes
    this.ano = json.ano
    this.cvv = json.cvv
    this.ano = json.ano
    this.nome = json.nome
    this.token = json.token
    this.cpf = json.cpf
    this.ativo = json.ativo
    return this
  }

  public static fromJson(json: any): Cartao {
    return new Cartao(1, '2', 'd', 'd', 'd', 'df', 'd', 's', '').fillFromJson(
      json,
    )
  }

  copy(): Cartao {
    // eslint-disable-next-line prefer-const
    let mpagamento = new Cartao(
      this.id,
      this.numero,
      this.mes,
      this.ano,
      this.bandeira,
      this.cvv,
      this.token,
      this.cpf,
      this.nome,
      this.ativo,
    )
    mpagamento.dados = this.dados
    return mpagamento
  }
}
