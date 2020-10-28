import { Alternativa } from '../alternativa/alternativa.entity'
import { VariacaoServico } from './variacao-servico.entity'

describe('Variacao-Servico', () => {
  it('test json Variacao-Servico', () => {
    const alternativa1 = new Alternativa(1, 'ALTERNATIVA 1', 1)
    const alternativa2 = new Alternativa(2, 'ALTERNATIVA 2', 1)
    const mockVariacao = new VariacaoServico(
      1,
      1,
      'Escolha o modelo',
      true,
      1,
      1,
      [alternativa1, alternativa2],
    )
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
    tipo: 1,
    titulo: 'Escolha o modelo',
    obrigatorio: true,
    id_servico: 1,
    qtsMaxima: 1,
    alternativas: [
      {
        ativo: true,
        id: 1,
        descricao: 'ALTERNATIVA 1',
        idVariacao: 1,
      },
      {
        ativo: true,
        id: 2,
        descricao: 'ALTERNATIVA 2',
        idVariacao: 1,
      },
    ],
  }
}
