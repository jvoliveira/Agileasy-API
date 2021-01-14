import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

class UpdatePrestadorDto {
  id: number
}

class InformacaoPortfolioDto {
  id: number
}

class CreatePortfolioDto {
  @IsString()
  @IsUrl()
  url: string
  @IsNumber()
  posicao: number
  @IsString()
  @IsOptional()
  descricao: string
  @IsOptional()
  informacao: InformacaoPortfolioDto
  @IsOptional()
  id_informacao: number
}

export class CreateInformacaoDto {
  @IsOptional()
  id: number
  @IsString()
  @IsOptional()
  @IsUrl()
  site: string
  @IsString()
  @IsOptional()
  instagram: string
  @IsString()
  @IsOptional()
  descricao: string
  @IsString()
  @IsOptional()
  facebook: string
  @IsString()
  @IsOptional()
  logo: string
  @IsString()
  @IsOptional()
  capa: string
  @IsOptional()
  portfolios: CreatePortfolioDto[]
  @IsOptional()
  prestador: UpdatePrestadorDto
}
