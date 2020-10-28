import { IsDateString, IsDefined, IsNumber } from 'class-validator'

class SituacaoDto {
  estado: number
  data: Date
}

class MetodoPagamentoDto {
  @IsNumber()
  id: number
}

class EnderecoDto {
  @IsNumber()
  id: number
}

class ServicoDto {
  @IsNumber()
  id: number
}

class ClienteDto {
  @IsNumber()
  id: number
}

class PrestadorDto {
  @IsNumber()
  id: number
}

export class CreatePedidoDto {
  subtotal?: number
  observacao?: string
  situacoes?: SituacaoDto[]
  @IsDateString()
  dataHora: Date
  @IsDefined()
  metodoPagamento: MetodoPagamentoDto
  @IsDefined()
  endereco: EnderecoDto
  @IsDefined()
  servicos: ServicoDto[]
  @IsDefined()
  cliente: ClienteDto
  @IsDefined()
  prestador: PrestadorDto
}
