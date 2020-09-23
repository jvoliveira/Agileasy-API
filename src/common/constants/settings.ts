import { TipoErroDados } from '../exceptions/interfaces/tipo-erro-dados.interface'
import { TipoErro } from '../exceptions/enums/tipo-erro.enum'

export const COMMON_ERRORS: TipoErroDados[] = [
  {
    errorId: TipoErro.USUARIO_SEM_PERMISSAO,
    message: 'Você não tem permissão para efetuar essa ação.',
  },
  {
    errorId: TipoErro.SEM_AUTENTICACAO,
    message: 'Você não está autenticado.',
  },
  {
    errorId: TipoErro.DOCUMENTO_NAO_ENCONTRADO,
    message: 'Documento não encontrado.',
  },
  {
    errorId: TipoErro.ERRO_CONEXAO_BD,
    message: 'Erro na comunicação com o Banco de Dados.',
  },
  {
    errorId: TipoErro.SERVICO_INDISPONIVEL,
    message: 'Serviço Indisponível.',
  },
  {
    errorId: TipoErro.ERRO_DE_COMUNICACAO,
    message: 'Erro de comunicação entre o Cliente e o Servidor.',
  },
  {
    errorId: TipoErro.ID_NAO_ENCONTRADO,
    message: 'Id não encontrado.',
  },
  {
    errorId: TipoErro.ERROR_AO_SALVAR,
    message: 'Houve um erro ao salvar.',
  },
  {
    errorId: TipoErro.ERROR_AO_ATUALIZAR,
    message: 'Erro ao atualizar.',
  },
  {
    errorId: TipoErro.ERROR_AO_DELETAR,
    message: 'Erro ao deletar',
  },
]
