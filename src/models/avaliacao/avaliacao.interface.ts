import { PedidoInterface } from '../pedidos/pedido.interface'

export interface AvaliacaoInterface {
  comentario: string
  nota: number
  pedido: PedidoInterface
  urlFoto: string
  quemAvaliou: number
}
