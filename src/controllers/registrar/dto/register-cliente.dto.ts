import {
  IsString,
  IsNumber,
  IsNumberString,
  IsEmail,
  Length,
} from 'class-validator'
export class RegisterClienteDto {
  @IsEmail()
  email: string
  @IsString()
  @Length(128, 128)
  senha: string
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
  bairro: string
  @IsString()
  referencia?: string
}
