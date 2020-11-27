import { Cliente } from './cliente.entity'
import * as moment from 'moment-timezone'
import { TipoStatus } from '../usuarios/usuario.interface'
import { Usuario } from '../usuarios/usuario.entity'
import { Endereco } from '../enderecos/endereco.entity'
import { Cartao } from '../cartoes/cartao.entity'

describe('Cliente', () => {
  it('test json cliente', () => {
    const enderecoCliente = new Endereco(
      1,
      'Casa',
      'Rua Alvaro Tinoco Lanes',
      'baixos',
      '105',
      'Itaperuna',
      'RJ',
      '28300-000',
      null,
      'São Mateus',
      false,
    )
    const cartaoCliente = new Cartao(
      1,
      '123456789',
      '06',
      '2025',
      'TOKENTOP',
      '14582486722',
    )
    const mockUsuario = new Usuario(
      1,
      TipoStatus.ativo,
      'João Vitor Oliveira',
      null,
      moment('2020-08-14T16:12:13-03:00').tz(moment.tz.guess()),
      '22999486347',
      '14582486722',
      'TOKENTOP',
      'foto_top',
      'vimivini99@gmail.com',
      'SERTVHijmouHINURVta',
    )
    const mockCliente = new Cliente(
      1,
      mockUsuario,
      [enderecoCliente],
      [cartaoCliente],
    )

    expect(JSON.parse(JSON.stringify(mockCliente))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockCliente).toStrictEqual(Cliente.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    usuario: {
      ativo: true,
      id: 1,
      status: 0,
      nome: 'João Vitor Oliveira',
      nomeSocial: null,
      dataNascimento: moment('2020-08-14T16:12:13-03:00').tz(moment.tz.guess()),
      telefone: '22999486347',
      cpf: '14582486722',
      uid: 'TOKENTOP',
      foto: 'foto_top',
      email: 'vimivini99@gmail.com',
      tokenNotificacao: 'SERTVHijmouHINURVta',
    },
    enderecos: [
      {
        ativo: true,
        id: 1,
        apelido: 'Casa',
        endereco: 'Rua Alvaro Tinoco Lanes',
        complemento: 'baixos',
        numero: '105',
        cidade: 'Itaperuna',
        estado: 'RJ',
        cep: '28300-000',
        referencia: null,
        bairro: 'São Mateus',
        favorito: false,
      },
    ],
    cartoes: [
      {
        ativo: true,
        id: 1,
        numero: '123456789',
        mes: '06',
        ano: '2025',
        token: 'TOKENTOP',
        cpf: '14582486722',
      },
    ],
  }
}
