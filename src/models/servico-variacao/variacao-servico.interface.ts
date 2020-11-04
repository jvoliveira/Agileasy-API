import { Alternativa } from '../alternativa/alternativa.entity'

export interface VariacaoServicoInterface {
  tipo: number
  titulo: string
  obrigatorio: boolean
  id_servico: number
  qtsMaxima: number
  alternativas: Array<Alternativa>
}
