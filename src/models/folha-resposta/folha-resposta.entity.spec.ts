import { FolhaResposta } from './folha-resposta.entity'

describe('Servico', () => {
  it('test json servico', () => {
    const mockServico = new FolhaResposta(1, true)

    expect(JSON.parse(JSON.stringify(mockServico))).toStrictEqual(
      JSON.parse(JSON.stringify(expectedJSON())),
    )
    expect(mockServico).toStrictEqual(FolhaResposta.fromJson(expectedJSON()))
  })
})

function expectedJSON() {
  return {
    id: 1,
    ativo: true,
  }
}
