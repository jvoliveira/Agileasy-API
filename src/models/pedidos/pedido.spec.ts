import { Pedido } from './pedido.entity'
import * as moment from 'moment-timezone'
import { Cartao } from '../cartoes/cartao.entity'
import { MetodoPagamento } from '../metodos-pagamento/metodo-pagamento.entity'
import { Situacao } from '../situacoes/situacao.entity'
import { Estado } from '../situacoes/situacao.interface'
import { Endereco } from '../enderecos/endereco.entity'
import { TipoPagamento } from '../metodos-pagamento/metodo-pagamento.interface'
import { Servico } from '../servicos/servico.entity'

describe('Pedido', () => {
  it('test json pedido', () => {
    const c = new Cartao(
      1,
      '123456789',
      '09',
      '2025',
      'TOKENTOP',
      '123455111111',
    )
    const p = new MetodoPagamento(1, TipoPagamento.cartaoCreditoOnline, c)
    const s = new Situacao(
      1,
      Estado.solicitado,
      moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
    )
    const e = new Endereco(
      1,
      'Casa',
      'Rua Alvaro Tinoco Lanes',
      'Baixos',
      '105',
      'Itaperuna',
      'RJ',
      '28300000',
      null,
    )
    const serv = new Servico(
      1,
      'Pintura de cômodo',
      150.0,
      'Pintura profissional',
      'URLDAFOTO',
    )
    const mockPedido = new Pedido(1, 150.0, 'Na casa verde', p, [s], e, [serv])

    expect(JSON.parse(JSON.stringify(mockPedido))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockPedido).toStrictEqual(Pedido.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    subtotal: 150,
    observacao: 'Na casa verde',
    metodoPagamento: {
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
      },
    },
    situacoes: [
      {
        ativo: true,
        id: 1,
        estado: 0,
        data: moment('2020-06-29T00:00:00-03:00').tz(moment.tz.guess()),
      },
    ],
    endereco: {
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
    },
    servicos: [
      {
        ativo: true,
        id: 1,
        descricao: 'Pintura de cômodo',
        valor: 150,
        nome: 'Pintura profissional',
        urlFoto: 'URLDAFOTO',
      },
    ],
  }
}
