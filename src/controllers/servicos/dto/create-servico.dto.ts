import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class CreateServicoDto {
  @IsString()
  descricao: string
  @IsNumber()
  valor: number
  @IsString()
  nome: string
  @IsUrl()
  urlFoto?: string
  @IsNumber()
  valorFrete: number
  @IsNumber()
  tempoMedio: number
  @IsBoolean()
  noEstabelecimento: boolean
  @IsBoolean()
  delivery: boolean
  prestador?: UpdatePrestadorDto
  @IsOptional()
  variacoesServico: []
}

class UpdatePrestadorDto {
  id: number
}
