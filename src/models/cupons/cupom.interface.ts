export enum TipoDesconto {
  VALOR = 0,
  PORCENTAGEM = 1,
}

export enum TipoCupom {
  NORMAL = 0, // Pode ser usado somente uma vez por usuário
  INDICACAO = 1, // Somente no primeiro serviço
  POR_CLIENTE = 2, // Cupom que o cliente recebe sem pedir, válido somente para alguns clientes
  POR_PRESTADOR = 3, // Cupom válidos somente para alguns prestadores
}

export interface CupomInterface {
  codigo: string
  desconto: number
  valorMinimo: number
  valorMaximo: number
  voucher: number
  validade: Date
  tipoCupom: number
  indicacao: boolean
  tipoDesconto: number
  quantidadeMaxima: number
  restantes: number
}
