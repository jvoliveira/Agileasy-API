export enum Estado {
  solicitado,
  aceito,
  andamento,
  cancelado,
  finalizado,
  avaliado,
}

export interface SituacaoInterface {
  estado: Estado
  data: Date
}
