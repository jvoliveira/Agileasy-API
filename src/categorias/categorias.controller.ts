import { Controller, Get } from '@nestjs/common'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import { ResponseDefault } from '../common/interfaces/response-default.interface'
import { CategoriasService } from './categorias.service'

@Controller('categorias')
export class CategoriasController {
  constructor(private serv: CategoriasService) {}
  @Get('pai')
  public async getCategoriaPai(): Promise<ResponseDefault> {
    const categorias = await this.serv.getParents()
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        categorias,
      },
    }
  }
}
