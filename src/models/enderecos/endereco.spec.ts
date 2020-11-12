import { Endereco } from './endereco.entity'

describe('Endereco', () => {
  it('test json endereco', () => {
    const mockEndereco = new Endereco(
      1,
      'Casa',
      'Rua Alvaro Tinoco Lanes',
      'Baixos',
      '105',
      'Itaperuna',
      'RJ',
      '28300000',
      null,
      true,
    )

    expect(JSON.parse(JSON.stringify(mockEndereco))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockEndereco).toStrictEqual(Endereco.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    apelido: 'Casa',
    endereco: 'Rua Alvaro Tinoco Lanes',
    complemento: 'Baixos',
    numero: '105',
    cidade: 'Itaperuna',
    estado: 'RJ',
    cep: '28300000',
    referencia: null,
    favorito: true,
  }
}
