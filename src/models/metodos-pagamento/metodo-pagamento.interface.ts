import { CartaoInterface } from '../cartoes/cartao.interface'

export enum TipoPagamento {
  dinheiro,
  cartaoCreditoOnline,
  cartaoDebitoOnline,
  cartaoCreditoEntrega,
  cartaoDebitoEntrega,
}

export interface MPagamentoInterface {
  tipoPagamento: TipoPagamento
  cartao: CartaoInterface | null
}
