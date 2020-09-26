import { Controller, Get, Post, Body } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { Roles } from '../common/decorators/roles.decorator'
import { CreatePrestadorDto } from './dto/create-prestador.dto'

@Controller('prestadores')
export class PrestadoresController {
  constructor(private serv: PrestadoresService) {}

  @Get()
  @Roles(0, 200)
  public async getAll() {
    const prestadores = await this.serv.getAll()

    return {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores,
      },
    }
  }
  @Post('criar')
  public async create(@Body() createPrestadorDto: CreatePrestadorDto) {
    createPrestadorDto.usuario.token = 'token-bom'
    const prestador = await this.serv.create(createPrestadorDto)
    return {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }
}
