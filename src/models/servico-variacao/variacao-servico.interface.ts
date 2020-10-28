import { AlternativaInterface } from '../alternativa/alternativa.interface'

export interface VariacaoServicoInterface {
  tipo: number
  titulo: string
  obrigatorio: boolean
  id_servico: number
  qtsMaxima: number
  alternativas: Array<AlternativaInterface>
}
