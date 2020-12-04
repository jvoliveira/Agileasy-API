import {
  IsString,
  IsNumber,
  IsNumberString,
  IsEmail,
  Length,
  IsOptional,
} from 'class-validator'
export class RegisterClienteDto {
  @IsEmail()
  email: string
  @IsString()
  @Length(128, 128)
  senha: string
  usuario: UsuarioDto
  endereco: EnderecoDto
  @IsOptional()
  enderecos?: [EnderecoDto] | null
  @IsOptional()
  criadoEm?: Date
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
  sexo: string
  @IsString()
  cpf: string
  @IsString()
  @IsOptional()
  uid?: string | null
  @IsString()
  @IsOptional()
  email?: string | null
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
  bairro: string
  @IsString()
  @IsOptional()
  referencia?: string | null
}
