import { IsDefined, IsOptional, IsString } from 'class-validator'
class CreateClienteDto {
  id: number
}
class CreateCartaoDto {
  @IsString()
  numero: string
  @IsString()
  mes: string
  @IsString()
  ano: string
  @IsOptional()
  token: string
  @IsString()
  cpf: string
  @IsString()
  bandeira: string
  @IsString()
  cvv: string
  @IsString()
  nome: string
  @IsOptional()
  cliente: CreateClienteDto
}

export class CreateMetodoPagamentoDto {
  @IsOptional()
  tipoPagamento: number
  @IsDefined()
  cartao: CreateCartaoDto
}
