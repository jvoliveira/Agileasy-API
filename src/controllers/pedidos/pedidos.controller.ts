import {
  Body,
  CacheTTL,
  Controller,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import * as moment from 'moment-timezone'
import { Estado } from '../../models/situacoes/situacao.interface'
import { ServicosService } from '../servicos/servicos.service'
import { AllException } from '../../common/exceptions/all.exception'
import { UserService } from '../../common/services/user.service'
import { User } from '../../common/decorators/user.decorator'
import * as admin from 'firebase-admin'
import { EnderecosService } from '../enderecos/enderecos.service'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private serv: PedidosService,
    private servServicos: ServicosService,
    private userService: UserService,
    private enderecoService: EnderecosService,
  ) {}

  @Roles(TipoUsuario.CLIENTE)
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

    newPedido.dataHora = moment(newPedido.dataHora)
      .utc()
      .toDate()

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

  @Roles(TipoUsuario.CLIENTE)
  @Get('cliente/eu')
  @CacheTTL(5)
  public async myPedidosAsCliente(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const cliente = await this.userService.getClienteByToken(user.uid)
    const pedidos = await this.serv.getPedidosAsCliente(cliente.id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedidos,
      },
    }
  }

  @Roles(TipoUsuario.PRESTADOR)
  @Get('prestador/eu')
  @CacheTTL(5)
  public async myPedidosAsPrestador(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestador = await this.userService.getPrestadorByToken(user.uid)
    const pedidos = await this.serv.getPedidosAsPrestador(prestador.id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedidos,
      },
    }
  }

  @Roles(TipoUsuario.PRESTADOR)
  @Get(':id/prestador/eu')
  @CacheTTL(5)
  public async getPedidoAsPrestadorById(
    @User() user: admin.auth.UserRecord,
    @Param('id') id: number,
  ): Promise<ResponseDefault> {
    const prestador = await this.userService.getPrestadorByToken(user.uid)
    const pedido = await this.serv.getByIdAsPrestador(id, prestador.id, true)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido,
      },
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Get(':id/cliente/eu')
  @CacheTTL(5)
  public async getPedidoAsClienteById(
    @User() user: admin.auth.UserRecord,
    @Param('id') id: number,
  ): Promise<ResponseDefault> {
    const prestador = await this.userService.getClienteByToken(user.uid)
    const pedido = await this.serv.getByIdAsCliente(id, prestador.id, true)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido,
      },
    }
  }

  @Patch(':id/marcar-aceito')
  @Roles(TipoUsuario.PRESTADOR)
  public async markAsAceito(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o prestador logado que está fazendo a solicitação
    const prestador = await this.userService.getPrestadorByToken(user.uid)

    // Pega o pedido referente aquele prestador, se o pedido não pertencer aquele prestador é dado falha
    const pedido = await this.serv.getByIdAsPrestador(idPedido, prestador.id)

    // Só pode ser feito se a última situação for solicitado
    if (pedido.situacoes.length > 0) {
      if (
        pedido.situacoes[pedido.situacoes.length - 1].estado !==
        Estado.solicitado
      ) {
        throw new AllException(TipoErro.SITUACAO_INVALIDA)
      }
    } else {
      throw new AllException(TipoErro.SITUACAO_INVALIDA)
    }

    // Muda a situação para em andamento
    const pedidoAtualizado = await this.serv.changeSituacao(pedido, {
      data: moment().toDate(),
      estado: Estado.aceito,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoAtualizado,
      },
    }
  }

  @Patch(':id/marcar-andamento')
  @Roles(TipoUsuario.PRESTADOR)
  public async markAsEmAndamento(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o prestador logado que está fazendo a solicitação
    const prestador = await this.userService.getPrestadorByToken(user.uid)

    // Pega o pedido referente aquele prestador, se o pedido não pertencer aquele prestador é dado falha
    const pedido = await this.serv.getByIdAsPrestador(idPedido, prestador.id)

    // Só pode ser feito se a última situação for aceito
    if (pedido.situacoes.length > 0) {
      if (
        pedido.situacoes[pedido.situacoes.length - 1].estado !== Estado.aceito
      ) {
        throw new AllException(TipoErro.SITUACAO_INVALIDA)
      }
    } else {
      throw new AllException(TipoErro.SITUACAO_INVALIDA)
    }
    // Muda a situação para em andamento
    const pedidoAtualizado = await this.serv.changeSituacao(pedido, {
      data: moment().toDate(),
      estado: Estado.andamento,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoAtualizado,
      },
    }
  }

  @Patch(':id/marcar-finalizado')
  @Roles(TipoUsuario.PRESTADOR)
  public async markAsFinalizado(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o prestador logado que está fazendo a solicitação
    const prestador = await this.userService.getPrestadorByToken(user.uid)

    // Pega o pedido referente aquele prestador, se o pedido não pertencer aquele prestador é dado falha
    const pedido = await this.serv.getByIdAsPrestador(idPedido, prestador.id)

    // Só pode ser feito se a última situação for em andamento
    if (pedido.situacoes.length > 0) {
      if (
        pedido.situacoes[pedido.situacoes.length - 1].estado !==
        Estado.andamento
      ) {
        throw new AllException(TipoErro.SITUACAO_INVALIDA)
      }
    } else {
      throw new AllException(TipoErro.SITUACAO_INVALIDA)
    }
    // Muda a situação para em andamento
    const pedidoAtualizado = await this.serv.changeSituacao(pedido, {
      data: moment().toDate(),
      estado: Estado.finalizado,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoAtualizado,
      },
    }
  }

  @Patch(':id/marcar-rejeitado')
  @Roles(TipoUsuario.PRESTADOR)
  public async markAsRejeitado(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o prestador logado que está fazendo a solicitação
    const prestador = await this.userService.getPrestadorByToken(user.uid)

    // Pega o pedido referente aquele prestador, se o pedido não pertencer aquele prestador é dado falha
    const pedido = await this.serv.getByIdAsPrestador(idPedido, prestador.id)

    // Só pode ser feito se Não for andamento ou posterior
    if (pedido.situacoes.length > 0) {
      if (
        pedido.situacoes[pedido.situacoes.length - 1].estado !==
        Estado.solicitado
      ) {
        throw new AllException(TipoErro.SITUACAO_INVALIDA)
      }
    } else {
      throw new AllException(TipoErro.SITUACAO_INVALIDA)
    }
    // Muda a situação para em andamento
    const pedidoRejeitado = await this.serv.changeSituacao(pedido, {
      data: moment().toDate(),
      estado: Estado.rejeitado,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoRejeitado,
      },
    }
  }

  @Patch(':id/prestador/cancelar')
  @Roles(TipoUsuario.PRESTADOR)
  public async cancelarPedidoAsPrestador(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o prestador logado que está fazendo a solicitação
    const prestador = await this.userService.getPrestadorByToken(user.uid)

    // Pega o pedido referente aquele prestador, se o pedido não pertencer aquele prestador é dado falha
    const pedido = await this.serv.getByIdAsPrestador(idPedido, prestador.id)

    // Só pode ser feito se Não for andamento ou posterior
    if (pedido.situacoes.length > 0) {
      if (
        pedido.situacoes[pedido.situacoes.length - 1].estado !== Estado.aceito
      ) {
        throw new AllException(TipoErro.SITUACAO_INVALIDA)
      }
    } else {
      throw new AllException(TipoErro.SITUACAO_INVALIDA)
    }
    // Muda a situação para em andamento
    const pedidoCancelado = await this.serv.changeSituacao(pedido, {
      data: moment().toDate(),
      estado: Estado.canceladoPrestador,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoCancelado,
      },
    }
  }

  @Patch(':id/cliente/cancelar')
  @Roles(TipoUsuario.CLIENTE)
  public async cancelarPedidoAsCliente(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o cliente logado que está fazendo a solicitação
    const cliente = await this.userService.getClienteByToken(user.uid)

    // Pega o pedido referente aquele cliente, se o pedido não pertencer aquele cliente é dado falha
    const pedido = await this.serv.getByIdAsCliente(idPedido, cliente.id)

    // Só pode ser feito se Não for andamento ou posterior
    if (pedido.situacoes.length > 0) {
      if (
        pedido.situacoes[pedido.situacoes.length - 1].estado !==
          Estado.aceito &&
        pedido.situacoes[pedido.situacoes.length - 1].estado !==
          Estado.solicitado
      ) {
        throw new AllException(TipoErro.SITUACAO_INVALIDA)
      }
    } else {
      throw new AllException(TipoErro.SITUACAO_INVALIDA)
    }

    // Muda a situação para em andamento
    const pedidoCancelado = await this.serv.changeSituacao(pedido, {
      data: moment().toDate(),
      estado: Estado.canceladoCliente,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedidoCancelado,
      },
    }
  }

  @Get(':id/cliente/informacoes')
  @Roles(TipoUsuario.CLIENTE)
  public async getByIdAsCliente(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o cliente logado que está fazendo a solicitação
    const cliente = await this.userService.getClienteByToken(user.uid)

    // Pega o pedido referente aquele cliente, se o pedido não pertencer aquele cliente é dado falha
    const pedido = await this.serv.getByIdAsCliente(idPedido, cliente.id)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedido,
      },
    }
  }

  @Get(':id/prestador/informacoes')
  @Roles(TipoUsuario.PRESTADOR)
  public async getByIdAsPrestador(
    @Param('id') idPedido,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    // Pega o prestador logado que está fazendo a solicitação
    const prestador = await this.userService.getPrestadorByToken(user.uid)

    // Pega o pedido referente aquele prestador, se o pedido não pertencer aquele prestador é dado falha
    const pedido = await this.serv.getByIdAsPrestador(idPedido, prestador.id)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        pedido: pedido,
      },
    }
  }
}
