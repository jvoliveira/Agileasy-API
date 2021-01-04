import { Cartao } from './cartao.entity'

describe('CartaoEntity', () => {
  it('should be defined', () => {
    const mockCartao = new Cartao(
      1,
      '123456789',
      '08',
      '2020',
      '123',
      'visa',
      'TOKENTOP',
      '03914582422',
      'Vinicius S Picanco',
    )
    expect(JSON.parse(JSON.stringify(mockCartao))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockCartao).toStrictEqual(Cartao.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    mes: '08',
    ano: '2020',
    token: 'TOKENTOP',
    cpf: '03914582422',
    numero: '123456789',
    cvv: '123',
    bandeira: 'visa',
    nome: 'Vinicius S Picanco',
  }
}
