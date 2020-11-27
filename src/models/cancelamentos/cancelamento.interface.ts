enum TipoMotivo {
  LOCAL_INVALIDO = 0,
  CLIENTE_NAO_PRESENTE = 1,
}

enum OrigemCancelamento {
  PRESTADOR = 0,
  CLIENTE = 1,
}

export interface CancelamentoInterface {
  motivo: string
  origem: number
  tipoMotivo: number
  consequencia: string
}
