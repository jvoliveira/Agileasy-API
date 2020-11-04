import { VariacaoServico } from './variacao-servico.entity'

describe('Variacao-Servico', () => {
  it('test json Variacao-Servico', () => {
    const mockVariacao = new VariacaoServico(
      1,
      1,
      'Escolha o modelo',
      true,
      1,
      1,
    )
    mockVariacao.alternativas = []
    expect(JSON.parse(JSON.stringify(mockVariacao))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockVariacao).toStrictEqual(VariacaoServico.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    alternativas: [],
    tipo: 1,
    titulo: 'Escolha o modelo',
    obrigatorio: true,
    id_servico: 1,
    qtsMaxima: 1,
  }
}
