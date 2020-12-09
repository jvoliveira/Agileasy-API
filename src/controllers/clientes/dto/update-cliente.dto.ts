import { IsDateString, IsOptional, IsString } from 'class-validator'
export class UpdateClienteDto {
  @IsDateString()
  @IsOptional()
  dataNascimento: string
  @IsString()
  @IsOptional()
  sexo: string
  @IsString()
  @IsOptional()
  cpf: string
  @IsString()
  @IsOptional()
  telefone: string
}
