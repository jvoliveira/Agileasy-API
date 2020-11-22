import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator'

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
}

class UpdatePrestadorDto {
  id: number
}
