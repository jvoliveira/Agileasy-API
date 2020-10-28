import { Alternativa } from '../alternativa/alternativa.entity'
import { VariacaoServico } from '../servico-variacao/variacao-servico.entity'
import { Servico } from './servico.entity'

describe('Servico', () => {
  it('test json servico', () => {
    const alternativa1 = new Alternativa(1, 'ALTERNATIVA 1', 1)
    const alternativa2 = new Alternativa(2, 'ALTERNATIVA 2', 1)
    const variacao = new VariacaoServico(1, 1, 'Escolha o modelo', true, 1, 1, [
      alternativa1,
      alternativa2,
    ])
    const mockServico = new Servico(
      1,
      'Pintura de cômodo',
      150,
      'Pintura profissional',
      'URLDAFOTO',
      true,
      variacao,
    )
    expect(JSON.parse(JSON.stringify(mockServico))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockServico).toStrictEqual(Servico.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    nome: 'Pintura profissional',
    descricao: 'Pintura de cômodo',
    valor: 150,
    urlFoto: 'URLDAFOTO',
    variacao: {
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
    },
  }
}
