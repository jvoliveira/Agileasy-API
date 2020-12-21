import { Body, Controller, Param, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { AvaliacoesService } from './avaliacoes.service'
import * as admin from 'firebase-admin'
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { PedidosService } from '../pedidos/pedidos.service'
import { UserService } from '../../common/services/user.service'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'

@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(
    private service: AvaliacoesService,
    private userService: UserService,
    private pedidoService: PedidosService,
  ) {}

  @Roles(TipoUsuario.CLIENTE)
  @Post('novo/cliente/eu')
  public async novaAvaliacao(
    @User() user: admin.auth.UserRecord,
    @Body() createAvaliacaoDto: CreateAvaliacaoDto,
  ): Promise<ResponseDefault> {
    const cliente = await this.userService.getClienteByToken(user.uid)
    const pedidoExiste = await this.pedidoService.getByIdAsCliente(
      createAvaliacaoDto.pedido.id,
      cliente.id,
    )

    if (!pedidoExiste) {
      throw new AllException(TipoErro.DADOS_INVALIDOS, 'Pedido inexistente')
    }

    createAvaliacaoDto.quemAvaliou = 0

    const avaliacao = await this.service.create(createAvaliacaoDto)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        avaliacao,
      },
    }
  }
}
