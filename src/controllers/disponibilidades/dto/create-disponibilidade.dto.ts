import { IsArray, IsBoolean, IsDate, IsNumber } from 'class-validator'
export class CreateDisponibilidadeDto {
  @IsArray()
  disponibilidades: DisponibilidadeDto[]
}

class DisponibilidadeDto {
  @IsNumber()
  diaSemana: number
  @IsDate()
  inicio: Date
  @IsDate()
  fim: Date
  @IsBoolean()
  excepcional: boolean
  prestador: PrestadorDto
}

class PrestadorDto {
  id: number
}
