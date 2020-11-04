import { Alternativa } from './alternativa.entity'

describe('Alternativa', () => {
  it('test json alternativa', () => {
    const mockAlternativa = new Alternativa(1, 'ALTERNATIVA 1')
    expect(JSON.parse(JSON.stringify(mockAlternativa))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockAlternativa).toStrictEqual(Alternativa.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    descricao: 'ALTERNATIVA 1',
  }
}
