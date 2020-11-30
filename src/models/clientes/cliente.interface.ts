import { EnderecoInterface } from '../enderecos/endereco.interface'
import { CartaoInterface } from '../cartoes/cartao.interface'

export interface ClienteInterface {
  enderecos: Array<EnderecoInterface>
  cartoes: Array<CartaoInterface> | null
  criadoEm: Date
}
