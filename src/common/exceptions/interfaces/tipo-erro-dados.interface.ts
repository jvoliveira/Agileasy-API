import { TipoErro } from '../../enums/tipo-erro.enum'

export interface TipoErroDados {
  errorId: TipoErro
  message: string
  httpStatus?: number
}
