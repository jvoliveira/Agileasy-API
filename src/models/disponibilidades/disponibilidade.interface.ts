export enum DiaSemana {
  QUALQUER = -1,
  SEGUNDA = 0,
  TERCA = 1,
  QUARTA = 2,
  QUINTA = 3,
  SEXTA = 4,
  SABADO = 5,
  DOMINGO = 7,
}

export interface DisponibilidadeInterface {
  diaSemana: number
  inicio: Date
  fim: Date
  excepcional: boolean
}
