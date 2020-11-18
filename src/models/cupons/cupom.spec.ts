import * as moment from 'moment-timezone'
import { Cupom } from './cupom.entity'

describe('Cupom', () => {
  it('test json cupom', () => {
    const mockCupom = new Cupom(
      1,
      false,
      '10%',
      1,
      10,
      2,
      20,
      moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
      true,
    )

    expect(JSON.parse(JSON.stringify(mockCupom))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockCupom).toStrictEqual(Cupom.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    id: 1,
    indicacao: false,
    codigo: '10%',
    desconto: 1,
    valorMinimo: 10,
    tipoCupom: 2,
    voucher: 20,
    validade: moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
    ativo: true,
  }
}
