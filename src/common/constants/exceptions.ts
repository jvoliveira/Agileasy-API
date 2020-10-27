import { TipoErroDados } from '../exceptions/interfaces/tipo-erro-dados.interface'
import { TipoErro } from '../enums/tipo-erro.enum'
import { HttpStatus } from '@nestjs/common'

export const COMMON_ERRORS: TipoErroDados[] = [
  {
    errorId: TipoErro.USUARIO_SEM_PERMISSAO,
    message: 'Você não tem permissão para efetuar essa ação.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  {
    errorId: TipoErro.SEM_AUTENTICACAO,
    message: 'Você não está autenticado.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  {
    errorId: TipoErro.DOCUMENTO_NAO_ENCONTRADO,
    message: 'Documento não encontrado.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  {
    errorId: TipoErro.ERRO_CONEXAO_BD,
    message: 'Erro na comunicação com o Banco de Dados.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  {
    errorId: TipoErro.SERVICO_INDISPONIVEL,
    message: 'Serviço Indisponível.',
    httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
  },
  {
    errorId: TipoErro.ERRO_DE_COMUNICACAO,
    message: 'Erro de comunicação entre o Cliente e o Servidor.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  {
    errorId: TipoErro.ID_NAO_ENCONTRADO,
    message: 'Id não encontrado.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  {
    errorId: TipoErro.ERROR_AO_SALVAR,
    message: 'Houve um erro ao salvar.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  {
    errorId: TipoErro.ERROR_AO_ATUALIZAR,
    message: 'Erro ao atualizar.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  {
    errorId: TipoErro.ERROR_AO_DELETAR,
    message: 'Erro ao deletar',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  {
    errorId: TipoErro.USUARIO_JA_EXISTE,
    message: 'Usuário já existe',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  {
    errorId: TipoErro.DADOS_INVALIDOS,
    message: 'Dados inválidos',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
]
