import { IsString } from 'class-validator'

export class UpdateEnderecoDto {
  @IsString()
  apelido: string
  @IsString()
  endereco: string
  complemento: string | null
  @IsString()
  numero: string
  @IsString()
  cidade: string
  @IsString()
  estado: string
  @IsString()
  cep: string
  referencia?: string | null
  cliente?: UpdateClienteDto
}

class UpdateClienteDto {
  id: number
}
