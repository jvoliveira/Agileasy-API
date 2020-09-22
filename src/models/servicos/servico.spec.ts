import { Servico } from './servico.entity'

describe('Servico', () => {
  it('test json servico', () => {
    const mockServico = new Servico(
      1,
      'Pintura de cômodo',
      150.0,
      'Pintura profissional',
      'URLDAFOTO',
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
  }
}
