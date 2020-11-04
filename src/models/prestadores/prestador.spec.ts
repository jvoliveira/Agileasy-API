import * as moment from 'moment-timezone'
import { Usuario } from '../usuarios/usuario.entity'
import { Categoria } from '../categorias/categoria.entity'
import { Servico } from '../servicos/servico.entity'
import { TipoStatus } from '../usuarios/usuario.interface'
import { Endereco } from '../enderecos/endereco.entity'
import { Prestador } from './prestador.entity'

describe('Prestador', () => {
  it('test json prestador', () => {
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
      true,
    )
    const categoriaPai = new Categoria(
      1,
      null,
      'Manutenção Residencial',
      'icone_legal',
    )
    const categoriaFilho = new Categoria(
      2,
      categoriaPai,
      'Troca de Chuveiro',
      'icone_legal',
    )
    const mockUsuario = new Usuario(
      1,
      TipoStatus.ativo,
      'João Oliveira',
      null,
      moment('1996-12-27T00:00:00-02:00').tz(moment.tz.guess()),
      '22999496547',
      '14582486722',
      'TOKENTOP',
      'foto_top',
    )
    const mockPrestador = new Prestador(
      1,
      mockUsuario,
      '30419000166',
      true,
      'UrlDoDocumento',
      'OLIVEIRA TECH',
      'Oliveira prestação de serviços',
      1,
      e,
      [serv],
      [categoriaPai, categoriaFilho],
      'logo_top',
      4.2,
      'capa_legal',
    )

    expect(JSON.parse(JSON.stringify(mockPrestador))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockPrestador).toStrictEqual(Prestador.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    ativo: true,
    id: 1,
    cnpj: '30419000166',
    delivery: true,
    documentoUrl: 'UrlDoDocumento',
    nomePublico: 'OLIVEIRA TECH',
    razaoSocial: 'Oliveira prestação de serviços',
    logo: 'logo_top',
    nota: 4.2,
    capa: 'capa_legal',
    tipoPessoa: 1,
    usuario: {
      ativo: true,
      id: 1,
      status: 0,
      nomeSocial: null,
      nome: 'João Oliveira',
      dataNascimento: moment('1996-12-27T00:00:00-02:00').tz(moment.tz.guess()),
      telefone: '22999496547',
      cpf: '14582486722',
      token: 'TOKENTOP',
      foto: 'foto_top',
    },
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
    categorias: [
      {
        ativo: true,
        id: 1,
        catPai: null,
        descricao: 'Manutenção Residencial',
        icone: 'icone_legal',
      },
      {
        ativo: true,
        id: 2,
        catPai: {
          ativo: true,
          id: 1,
          catPai: null,
          descricao: 'Manutenção Residencial',
          icone: 'icone_legal',
        },
        descricao: 'Troca de Chuveiro',
        icone: 'icone_legal',
      },
    ],
  }
}
