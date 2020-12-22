import {
  IsBoolean,
  IsDefined,
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
  categorias: UpdateCategoriaDto[]
  @IsOptional()
  variacoesServico: AddVariacaoServicoDto[]
}

class UpdateCategoriaDto {
  id: number
}

class UpdatePrestadorDto {
  id: number
}

class AddVariacaoServicoDto {
  @IsNumber()
  tipo: number
  @IsString()
  titulo: string
  @IsBoolean()
  obrigatorio: boolean
  @IsBoolean()
  ativo: boolean
  @IsNumber()
  qtsMaxima: number
  @IsDefined()
  alternativas: Array<AddAlternativaDto>
}

class AddAlternativaDto {
  @IsString()
  @IsOptional()
  descricao: string
  @IsString()
  @IsOptional()
  titulo: string
  @IsNumber()
  valor: number
}
