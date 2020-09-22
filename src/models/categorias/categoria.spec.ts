import { Categoria } from './categoria.entity'

describe('Categoria', () => {
  it('test json categoria', () => {
    const mockCategoriaPai = new Categoria(1, null, 'Manutenção Residencial')

    const mockCategoriaFilho = new Categoria(
      2,
      mockCategoriaPai,
      'Troca de Chuveiro',
    )
    expect(JSON.parse(JSON.stringify(mockCategoriaFilho))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockCategoriaFilho).toStrictEqual(Categoria.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 2,
    catPai: {
      ativo: true,
      id: 1,
      catPai: null,
      descricao: 'Manutenção Residencial',
    },
    descricao: 'Troca de Chuveiro',
  }
}
