import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { UserService } from '../../common/services/user.service'
import { InformacoesService } from './informacoes.service'
import { CreateInformacaoDto } from './dto/create-informacao.dto'

@Controller('informacoes')
export class InformacoesController {
  constructor(
    private serv: InformacoesService,
    private userService: UserService,
  ) {}
  @Post('atualizar/prestador/eu')
  @Roles(TipoUsuario.PRESTADOR)
  public async updateProfile(
    @User() user: admin.auth.UserRecord,
    @Body() informacaoDto: CreateInformacaoDto,
  ): Promise<ResponseDefault> {
    const prestadorFull = await this.userService.getPrestadorByToken(user.uid)
    const informacao = await this.serv.getByIdPrestador(prestadorFull.id)
    if (informacao) {
      informacaoDto.id = informacao.id
    }

    informacaoDto.prestador = { id: prestadorFull.id }
    const capa = informacaoDto.capa ?? prestadorFull.capa
    const logo = informacaoDto.logo ?? prestadorFull.logo
    delete informacaoDto.capa
    delete informacaoDto.logo
    const informacaoSave = await this.serv.newInformacao(
      informacaoDto as any,
      capa,
      logo,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        informacao: informacaoSave,
      },
    }
  }

  @Get('prestador/eu')
  @Roles(TipoUsuario.PRESTADOR)
  public async getProfile(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestadorFull = await this.userService.getPrestadorByToken(user.uid)

    const informacao = await this.serv.getByIdPrestador(prestadorFull.id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        informacao: informacao,
      },
    }
  }

  @Get('prestador/:id')
  @Roles(-1)
  public async getProfileAsCliente(
    @Param('id') idPrestador,
  ): Promise<ResponseDefault> {
    const informacao = await this.serv.getByIdPrestador(idPrestador)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        informacao: informacao,
      },
    }
  }
}
