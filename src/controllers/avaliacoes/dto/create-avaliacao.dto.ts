import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

class PedidoDto {
  @IsNumber()
  id: number
}

export class CreateAvaliacaoDto {
  @IsString()
  @IsOptional()
  comentario: string
  @IsNumber()
  nota: number

  @IsOptional()
  @IsUrl()
  urlFoto: string
  @IsNumber()
  @IsOptional()
  quemAvaliou: number

  @IsDefined()
  pedido: PedidoDto
}
