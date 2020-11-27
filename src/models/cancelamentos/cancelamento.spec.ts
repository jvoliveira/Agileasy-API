import { Cancelamento } from './cancelamento.entity'

describe('Cancelamento', () => {
  it('test json cancelamento', () => {
    const mockCancelamento = new Cancelamento(
      1,
      'Profissional ineficiente',
      1,
      'Cortamos ele',
      0,
      true,
    )

    expect(JSON.parse(JSON.stringify(mockCancelamento))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockCancelamento).toStrictEqual(
      Cancelamento.fromJson(expectedJSON()),
    )
  })
})

function expectedJSON() {
  return {
    id: 1,
    motivo: 'Profissional ineficiente',
    tipoMotivo: 1,
    consequencia: 'Cortamos ele',
    origem: 0,
    ativo: true,
  }
}
