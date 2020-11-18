export enum TipoStatus {
  ativo,
  suspenso,
  desativado,
  banido,
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
}
