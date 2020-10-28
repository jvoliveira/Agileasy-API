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
import { UserService } from '../common/services/user.service'
import { User } from '../common/decorators/user.decorator'
import * as admin from 'firebase-admin'
import { EnderecosService } from '../enderecos/enderecos.service'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private serv: PedidosService,
    private servServicos: ServicosService,
    private userService: UserService,
    private enderecoService: EnderecosService,
  ) {}

  @Roles(200)
  @Post('novo')
  public async newPedido(
    @Body() newPedido: CreatePedidoDto,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    newPedido.situacoes = []
    // Cria uma nova situação do tipo solicitação
    newPedido.situacoes.push({
      data: moment().toDate(),
      estado: Estado.solicitado,
    })

    const cliente = await this.userService.getClienteByToken(user.uid)

    if (cliente.id !== newPedido.cliente.id) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }

    if (moment(newPedido.dataHora).isBefore(moment().add(5, 'minutes'))) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'O serviço deve ser realizado pelo menos 5 minutos depois da requisição.',
      )
    }

    const endereco = await this.enderecoService.getByIdWithCliente(
      newPedido.endereco.id,
    )

    if (!endereco.cliente || endereco.cliente.id !== newPedido.cliente.id) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'O endereço não corresponde ao cliente da requisição.',
      )
    }

    newPedido.subtotal = 0
    const servicosCompletos = []
    for (const servicoId of newPedido.servicos) {
      const servico = await this.servServicos.getByIdWithPrestador(servicoId.id)
      newPedido.subtotal += servico.valor
      servicosCompletos.push(servico)
      if (servico.prestador.id !== newPedido.prestador.id) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'Os serviços deve pertencer ao mesmo prestador',
        )
      }
    }

    const pedido = await this.serv.create(newPedido)
    pedido.endereco = endereco
    pedido.servicos = servicosCompletos
    pedido.cliente = cliente
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
