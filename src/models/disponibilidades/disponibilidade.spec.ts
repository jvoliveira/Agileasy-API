import * as moment from 'moment-timezone'
import { Disponibilidade } from './disponibilidade.entity'

describe('Disponibilidade', () => {
  it('test json disponibilidade', () => {
    const mockDisponibilidade = new Disponibilidade(
      1,
      false,
      1,
      moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
      moment('2020-06-30T00:00:00-03:00').tz(moment.tz.guess()),
    )

    expect(JSON.parse(JSON.stringify(mockDisponibilidade))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockDisponibilidade).toStrictEqual(
      Disponibilidade.fromJson(expectedJSON()),
    )
  })
})

function expectedJSON() {
  return {
    id: 1,
    inicio: moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
    fim: moment('2020-06-30T00:00:00-03:00').tz(moment.tz.guess()),
    diaSemana: 1,
    excepcional: false,
    ativo: true,
  }
}
