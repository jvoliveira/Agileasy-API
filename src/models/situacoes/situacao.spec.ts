import { Situacao } from './situacao.entity'
import * as moment from 'moment-timezone'
import { Estado } from './situacao.interface'

describe('Situacao', () => {
  it('test json situacao', () => {
    const mockSituacao = new Situacao(
      1,
      Estado.solicitado,
      moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
    )
    expect(JSON.parse(JSON.stringify(mockSituacao))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockSituacao).toStrictEqual(Situacao.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    id: 1,
    data: moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
    estado: 0,
    ativo: true,
  }
}
