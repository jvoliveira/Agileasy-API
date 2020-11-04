import { Avaliacao } from './avaliacao.entity'

describe('Avaliacao', () => {
  it('test json avaliacao', () => {
    const mockAvaliacao = new Avaliacao(
      1,
      'Achei muito bom, recomendo',
      5,
      'URLDAFOTO',
      1,
    )

    expect(JSON.parse(JSON.stringify(mockAvaliacao))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockAvaliacao).toStrictEqual(Avaliacao.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    comentario: 'Achei muito bom, recomendo',
    nota: 5,
    urlFoto: 'URLDAFOTO',
    quemAvaliou: 1,
  }
}
