import { IsDateString, IsDefined, IsNumber, IsOptional } from 'class-validator'

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

class CupomDto {
  @IsNumber()
  id: number
}

class AlternativaDto {
  @IsDefined()
  id: number
  descricao: string
  titulo: string
  valor: number
}

class FolhaRespostaDto {
  @IsDefined()
  alternativa: AlternativaDto
  @IsNumber()
  quantidade: number
}

export class CreatePedidoDto {
  total?: number
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
  @IsDefined()
  emDomicilio: boolean
  @IsOptional()
  cupom?: CupomDto
  @IsOptional()
  folhasRespostas: FolhaRespostaDto[]
}
