import { MPagamentoInterface } from '../metodos-pagamento/metodo-pagamento.interface'
import { SituacaoInterface } from '../situacoes/situacao.interface'
import { EnderecoInterface } from '../enderecos/endereco.interface'
import { ServicoInterface } from '../servicos/servico.interface'

export interface PedidoInterface {
  subtotal: number
  observacao: string | null
  dataHora: Date
  metodoPagamento: MPagamentoInterface
  situacoes: SituacaoInterface[]
  endereco: EnderecoInterface
  servicos: ServicoInterface[]
  emDomicilio: boolean
  fidChat: string
}
