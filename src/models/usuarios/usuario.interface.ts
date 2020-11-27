export enum TipoStatus {
  ativo = 0,
  em_analise = 1,
  suspenso = 2,
  desativado = 3,
  banido = 4,
}

export interface UsuarioInterface {
  nome: string
  dataNascimento: Date
  telefone: string
  cpf: string
  uid: string
  email: string
  status: TipoStatus
  foto: string
  tokenNotificacao: string
}
