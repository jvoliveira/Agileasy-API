import { ServicosService } from './servicos.service'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { CreateServicoDto } from './dto/create-servico.dto'
import { UpdateServicoDto } from './dto/update-servico.dto'
import { AllException } from '../../common/exceptions/all.exception'

@Controller('servicos')
export class ServicosController {
  constructor(
    private serv: ServicosService,
    private userService: UserService,
  ) {}

  @Roles(TipoUsuario.PRESTADOR)
  @Get('prestador/eu')
  public async getServicosByPrestador(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestadorIncompleto = await this.userService.getPrestadorByToken(
      user.uid,
    )
    const servicos = await this.serv.getServicoByPrestador(
      prestadorIncompleto.id,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        servicos,
      },
    }
  }

  @Roles(TipoUsuario.PRESTADOR)
  @Post('adicionar/prestador/eu')
  public async addServico(
    @User() user: admin.auth.UserRecord,
    @Body() createServicoDto: CreateServicoDto,
  ): Promise<ResponseDefault> {
    const prestadorIncompleto = await this.userService.getPrestadorByToken(
      user.uid,
    )
    createServicoDto.prestador = {
      id: prestadorIncompleto.id,
    }
    const servico = await this.serv.create(createServicoDto)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        servico,
      },
    }
  }

  @Roles(TipoUsuario.PRESTADOR)
  @Delete(':id/prestador/eu')
  public async removeServico(
    @User() user: admin.auth.UserRecord,
    @Param('id') id: number,
  ): Promise<ResponseDefault> {
    const prestadorIncompleto = await this.userService.getPrestadorByToken(
      user.uid,
    )

    const servico = await this.serv.getByIdWithPrestador(id)
    if (prestadorIncompleto.id !== servico.prestador.id) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }
    await this.serv.delete(id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
  }

  @Roles(TipoUsuario.PRESTADOR)
  @Put(':id/alterar/prestador/eu')
  public async updateServico(
    @User() user: admin.auth.UserRecord,
    @Param('id') id: number,
    @Body() updateServicoDto: UpdateServicoDto,
  ): Promise<ResponseDefault> {
    const prestadorIncompleto = await this.userService.getPrestadorByToken(
      user.uid,
    )
    const servicoReceive = await this.serv.getByIdWithPrestador(id)
    if (prestadorIncompleto.id !== servicoReceive.prestador.id) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }

    await this.serv.delete(id)

    delete updateServicoDto.id

    updateServicoDto.prestador = { id: prestadorIncompleto.id }

    const servico = await this.serv.create(updateServicoDto)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        servico,
      },
    }
  }
}
