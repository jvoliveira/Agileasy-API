import { MetodoPagamento } from './metodo-pagamento.entity'
import { TipoPagamento } from './metodo-pagamento.interface'
import { Cartao } from '../cartoes/cartao.entity'

describe('MetodoPagamento', () => {
  it('test json metodo pagamento', () => {
    const c = new Cartao(
      1,
      '123456789',
      '09',
      '2025',
      'TOKENTOP',
      '123455111111',
      'visa',
      '123',
      'vinicius',
    )
    const mockPagamento = new MetodoPagamento(
      1,
      TipoPagamento.cartaoCreditoOnline,
      c,
    )
    expect(JSON.parse(JSON.stringify(mockPagamento))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockPagamento).toStrictEqual(
      MetodoPagamento.fromJson(expectedJSON()),
    )
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    tipoPagamento: 1,
    cartao: {
      ativo: true,
      id: 1,
      numero: '123456789',
      mes: '09',
      ano: '2025',
      token: 'TOKENTOP',
      cpf: '123455111111',
      bandeira: 'visa',
      cvv: '123',
      nome: 'vinicius',
    },
  }
}
