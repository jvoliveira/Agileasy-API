import { Usuario } from './usuario.entity'
import { TipoStatus } from './usuario.interface'
import * as moment from 'moment-timezone'
describe('Usuario', () => {
  it('test json usuario', () => {
    const mockUsuario = new Usuario(
      1,
      TipoStatus.ativo,
      'Joao Oliveira',
      null,
      moment('1996-12-27T00:00:00-02:00').tz(moment.tz.guess()),
      '22999486347',
      '14582486722',
      'TOKETOP',
      'foto_legal',
      'vimivini99@gmail.com',
      'SERTVHijmouHINURVta',
    )
    expect(JSON.parse(JSON.stringify(mockUsuario))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockUsuario).toStrictEqual(Usuario.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    status: 0,
    nomeSocial: null,
    nome: 'Joao Oliveira',
    dataNascimento: moment('1996-12-27T00:00:00-02:00').tz(moment.tz.guess()),
    telefone: '22999486347',
    cpf: '14582486722',
    uid: 'TOKETOP',
    foto: 'foto_legal',
    email: 'vimivini99@gmail.com',
    tokenNotificacao: 'SERTVHijmouHINURVta',
  }
}
