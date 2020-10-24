import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { Roles } from '../common/decorators/roles.decorator'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { ResponseDefault } from '../common/interfaces/response-default.interface'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import * as moment from 'moment-timezone'
import { Estado } from '../models/situacoes/situacao.interface'
import { ServicosService } from '../servicos/servicos.service'
import { AllException } from '../common/exceptions/all.exception'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private serv: PedidosService,
    private servServicos: ServicosService,
  ) {}

  @Roles(200)
  @Post('novo')
  public async newPedido(
    @Body() newPedido: CreatePedidoDto,
  ): Promise<ResponseDefault> {
    newPedido.situacoes = []
    // Cria uma nova situação do tipo solicitação
    newPedido.situacoes.push({
      data: moment().toDate(),
      estado: Estado.solicitado,
    })

    if (moment(newPedido.dataHora).isBefore(moment().add(5, 'minutes'))) {
      throw new HttpException(
        'O serviço deve ser realizado pelo menos 5 minutos depois da requisição.',
        400,
      )
    }

    newPedido.subtotal = 0
    for (const servicoId of newPedido.servicos) {
      const servico = await this.servServicos.getByID(servicoId.id)
      newPedido.subtotal += servico.valor
    }

    const pedido = await this.serv.create(newPedido)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido,
      },
    }
  }
}
