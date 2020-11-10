import {
  IsString,
  IsUrl,
  IsNumber,
  IsBoolean,
  IsNumberString,
} from 'class-validator'
export class CreatePrestadorDto {
  @IsString()
  cnpj: string
  @IsBoolean()
  delivery: boolean
  @IsUrl()
  documentoUrl: string
  @IsString()
  nomePublico: string
  @IsString()
  razaoSocial: string
  @IsNumber()
  tipoPessoa: number
  usuario: UsuarioDto
  endereco: EnderecoDto
}

class UsuarioDto {
  @IsNumber()
  status: number
  @IsString()
  nome: string
  @IsString()
  dataNascimento: string
  @IsString()
  telefone: string
  @IsString()
  cpf: string
  @IsString()
  token?: string
}

class EnderecoDto {
  @IsString()
  apelido: string
  @IsString()
  endereco: string
  @IsString()
  complemento: string
  @IsNumberString()
  numero: string
  @IsString()
  cidade: string
  @IsString()
  estado: string
  @IsString()
  cep: string
  @IsString()
  referencia?: string
}
