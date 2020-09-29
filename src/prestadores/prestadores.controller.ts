import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { Roles } from '../common/decorators/roles.decorator'
import { CreatePrestadorDto } from './dto/create-prestador.dto'
import { ResponseDefault } from '../common/interfaces/response-default.interface'
import { TipoErro } from '../common/enums/tipo-erro.enum'

@Controller('prestadores')
export class PrestadoresController {
  constructor(private serv: PrestadoresService) {}

  @Get()
  @Roles(0, 200)
  public async getAll(): Promise<ResponseDefault> {
    const prestadores = await this.serv.getAll()
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores,
      },
    }
  }

  @Get(':id')
  public async get(@Param('id') id: number): Promise<ResponseDefault> {
    const prestador = await this.serv.getByID(id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }

  @Post('criar')
  public async create(
    @Body() createPrestadorDto: CreatePrestadorDto,
  ): Promise<ResponseDefault> {
    createPrestadorDto.usuario.token = 'token-bom'
    const prestador = await this.serv.create(createPrestadorDto)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }
}
