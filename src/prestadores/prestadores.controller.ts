import { Controller, Get, Post, Body } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'

@Controller('prestadores')
export class PrestadoresController {
  constructor(private serv: PrestadoresService) {}

  @Get()
  public async getAll() {
    return this.serv.getAll()
  }
  @Post('criar')
  public async create(@Body() createCatDto) {
    return this.serv.create(createCatDto)
  }
}
