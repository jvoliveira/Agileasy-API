import { Controller, Get, Post, Body } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { Roles } from '../common/decorators/roles.decorator'

@Controller('prestadores')
export class PrestadoresController {
  constructor(private serv: PrestadoresService) {}

  @Get()
  @Roles(0, 200)
  public async getAll() {
    return this.serv.getAll()
  }
  @Post('criar')
  public async create(@Body() createCatDto) {
    return this.serv.create(createCatDto)
  }
}
