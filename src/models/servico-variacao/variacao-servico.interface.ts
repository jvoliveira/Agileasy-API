import { Alternativa } from '../alternativa/alternativa.entity'

export interface VariacaoServicoInterface {
  tipo: number
  titulo: string
  obrigatorio: boolean
  qtsMaxima: number
  alternativas: Array<Alternativa>
}
