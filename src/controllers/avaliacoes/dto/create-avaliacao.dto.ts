import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

class PedidoDto {
  @IsNumber()
  id: number
}

export class CreateAvaliacaoDto {
  @IsString()
  comentario: string
  @IsNumber()
  nota: number

  @IsOptional()
  @IsUrl()
  urlFoto: string
  @IsNumber()
  quemAvaliou: number

  pedido: PedidoDto
}
