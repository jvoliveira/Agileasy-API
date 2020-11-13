import { Controller, Get } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { MetodosPagamentoService } from './metodos-pagamento.service'

@Controller('metodos-pagamento')
export class MetodosPagamentoController {
  constructor(private serv: MetodosPagamentoService) {}
  @Roles(TipoUsuario.CLIENTE)
  @Get('comuns')
  public async getCommonsMetodosPagamento(): Promise<ResponseDefault> {
    const metodosPagamento = await this.serv.getAll()
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        metodosPagamento,
      },
    }
  }
}
