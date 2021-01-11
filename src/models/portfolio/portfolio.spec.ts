import { Portfolio } from "./portfolio.entity"

describe('Portfolio', () => {
  it('test json portfolio', () => {
    const mockAlternativa = new Portfolio(1, 'PORTFOLIO 1', 'www.google.com', 0)
    expect(JSON.parse(JSON.stringify(mockAlternativa))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockAlternativa).toStrictEqual(Portfolio.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    descricao: 'PORTFOLIO 1',
    url: 'www.google.com',
    posicao: 0
  }
}
