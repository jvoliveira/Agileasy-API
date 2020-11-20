import { IsArray, IsBoolean, IsDate, IsNumber } from 'class-validator'
export class AddDisponibilidadeDto {
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
}
