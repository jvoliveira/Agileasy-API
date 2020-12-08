import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
export class CreateCupomDto {
  @IsString()
  codigo: string
  @IsNumber()
  desconto: number
  @IsNumber()
  valorMinimo: number
  @IsNumber()
  voucher: number
  @IsDateString()
  validade: string
  @IsNumber()
  tipoCupom: number
  @IsBoolean()
  indicacao: boolean
  @IsNumber()
  tipoDesconto: number
  @IsBoolean()
  @IsOptional()
  ativo: boolean
}
