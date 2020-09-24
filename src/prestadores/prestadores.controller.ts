import { Controller, Get, Post, Body } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { Roles } from '../common/decorators/roles.decorator'

@Controller('prestadores')
@Roles(0, 100)
export class PrestadoresController {
  constructor(private serv: PrestadoresService) {}

  @Get()
  public async getAll() {
    console.log('here')

    return this.serv.getAll()
  }
  @Post('criar')
  public async create(@Body() createCatDto) {
    return this.serv.create(createCatDto)
  }
}
