export enum Estado {
  solicitado = 0,
  aceito = 1,
  rejeitado = 2,
  andamento = 3,
  canceladoPrestador = 4,
  canceladoCliente = 5,
  finalizado = 6,
  avaliado = 7,
}

export interface SituacaoInterface {
  estado: Estado
  data: Date
}
