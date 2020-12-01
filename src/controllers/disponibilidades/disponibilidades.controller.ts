import { Body, CacheTTL, Controller, Get, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import * as admin from 'firebase-admin'
import { CreateDisponibilidadeDto } from './dto/create-disponibilidade.dto'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { DisponibilidadesService } from './disponibilidades.service'
import { UserService } from '../../common/services/user.service'
import * as moment from 'moment-timezone'
import { Disponibilidade } from '../../models/disponibilidades/disponibilidade.entity'
import { TipoErro } from '../../common/enums/tipo-erro.enum'

@Controller('disponibilidades')
export class DisponibilidadesController {
  constructor(
    private serv: DisponibilidadesService,
    private userService: UserService,
  ) {}

  @Roles(TipoUsuario.PRESTADOR)
  @Post('adicionar/prestador/eu')
  public async addDisponibilidades(
    @Body() addDisponibilidades: CreateDisponibilidadeDto,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestadorFull = await this.userService.getPrestadorByToken(user.uid)
    const id = prestadorFull.id
    const newDisponibilidades = []
    // Converte os json dos serviços em uma identidade
    for (const disponibilidade of addDisponibilidades.disponibilidades) {
      const dispo = Disponibilidade.fromJson(disponibilidade)
      dispo.prestador = { id } as any
      dispo.inicio = moment(dispo.inicio)
        .utc()
        .toDate()
      dispo.fim = moment(dispo.fim)
        .utc()
        .toDate()
      newDisponibilidades.push(dispo)
    }

    const disponibilidades = await this.serv.updateAllDisponibilidade(
      id,
      newDisponibilidades,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        disponibilidades,
      },
    }
  }

  @Roles(TipoUsuario.PRESTADOR)
  @Get('prestador/eu')
  public async getAllDisponibilidades(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestadorFull = await this.userService.getPrestadorByToken(user.uid)
    const id = prestadorFull.id

    const disponibilidades = await this.serv.getAllDisponibilidesByPrestador(id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        disponibilidades,
      },
    }
  }
}
