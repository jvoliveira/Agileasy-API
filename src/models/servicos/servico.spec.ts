import { Alternativa } from '../alternativa/alternativa.entity'
import { VariacaoServico } from '../servico-variacao/variacao-servico.entity'
import { Servico } from './servico.entity'

describe('Servico', () => {
  it('test json servico', () => {
    const alternativa1 = new Alternativa(1, 'ALTERNATIVA 1')
    const alternativa2 = new Alternativa(2, 'ALTERNATIVA 2')
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

    console.log(JSON.stringify(mockServico))

    expect(JSON.parse(JSON.stringify(mockServico))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockServico).toStrictEqual(Servico.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    id: 1,
    ativo: true,
    descricao: 'Pintura de cômodo',
    valor: 150,
    nome: 'Pintura profissional',
    urlFoto: 'URLDAFOTO',
    variacao: {
      ativo: true,
      id: 1,
      id_servico: 1,
      obrigatorio: true,
      qtsMaxima: 1,
      tipo: 1,
      titulo: 'Escolha o modelo',
      alternativas: [
        { ativo: true, descricao: 'ALTERNATIVA 1', id: 1 },
        { ativo: true, descricao: 'ALTERNATIVA 2', id: 2 },
      ],
    },
  }
}
