import { VariacaoServico } from '../servico-variacao/variacao-servico.entity'

export interface ServicoInterface {
  descricao: string
  valor: number
  nome: string
  urlFoto: string
  variacao: VariacaoServico
  valorFrete: number
  tempoMedio: number
  noEstabelecimento: boolean
  delivery: boolean
}
