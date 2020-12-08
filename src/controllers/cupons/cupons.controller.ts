import { Body, Controller, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { CuponsService } from './cupons.service'
import { CreateCupomDto } from './dto/create-cupom.dto'
import * as moment from 'moment-timezone'

@Controller('cupons')
export class CuponsController {
  constructor(private service: CuponsService) {}
  @Post('novo')
  @Roles(TipoUsuario.ADMIN)
  public async createNewCupom(
    @Body() createCupomDto: CreateCupomDto,
  ): Promise<ResponseDefault> {
    createCupomDto.ativo = true
    createCupomDto.validade = moment(createCupomDto.validade)
      .utc()
      .format()

    const cupom = await this.service.create(createCupomDto)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cupom,
      },
    }
  }
}
