import { Servico } from './servico.entity'

describe('Servico', () => {
  it('test json servico', () => {
    const mockServico = new Servico(
      1,
      'Pintura de cômodo',
      150,
      'Pintura profissional',
      'URLDAFOTO',
      true,
    )

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
  }
}
