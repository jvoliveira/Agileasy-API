import { Informacao } from './informacao.entity'

describe('Informacao', () => {
  it('test json portfolio', () => {
    const mockAlternativa = new Informacao(
      1,
      'descrição',
      'instagram',
      'facebook',
      'site',
    )
    expect(JSON.parse(JSON.stringify(mockAlternativa))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockAlternativa).toStrictEqual(Informacao.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    descricao: 'descrição',
    instagram: 'instagram',
    facebook: 'facebook',
    site: 'site',
  }
}
