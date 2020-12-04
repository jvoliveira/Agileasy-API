import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class UpdateServicoDto {
  @IsOptional()
  id?: number
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
  @IsOptional()
  categorias: UpdateCategoriaDto[]
}

class UpdateCategoriaDto {
  id: number
}

class UpdatePrestadorDto {
  id: number
}
