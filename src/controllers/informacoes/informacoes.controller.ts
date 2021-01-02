import { Body, Controller, Get, Post } from '@nestjs/common'
import { admin } from 'firebase-admin/lib/auth'
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
  @Post('update')
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
    const informacaoSave = await this.serv.newInformacao(informacaoDto as any)
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
}
