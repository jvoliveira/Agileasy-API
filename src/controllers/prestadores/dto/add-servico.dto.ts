import { IsArray, IsNumber, IsString, IsUrl } from 'class-validator'
export class AddServicoDto {
  @IsArray()
  servicos: ServicoDto[]
}

class ServicoDto {
  @IsString()
  descricao: string
  @IsNumber()
  valor: number
  @IsString()
  nome: string
  @IsUrl()
  urlFoto: string
}
