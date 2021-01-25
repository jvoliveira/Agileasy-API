import { EnderecoInterface } from '../enderecos/endereco.interface'
import { ServicoInterface } from '../servicos/servico.interface'
import { CategoriaInterface } from '../categorias/categoria.interface'

export interface PrestadorInterface {
  documentoUrl: string
  tipoPessoa: number
  cnpj: string | null
  razaoSocial: string | null
  nomePublico: string
  delivery: boolean
  endereco: EnderecoInterface
  servicos: Array<ServicoInterface>
  categorias: Array<CategoriaInterface>
  logo: string
  capa: string
  nota: number
  taxa: number
  criadoEm: Date
  tokenNotificacao: string
  cidadesAtua: string[]
  metodosPagamentoAceitos: number[]
}
