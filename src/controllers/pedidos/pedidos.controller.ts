import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { DEFAULT_NOTIFICATION } from '../../common/constants/notification'
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
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { ClientesService } from '../clientes/clientes.service'
import { MailManager } from '../../common/mails/mail.manager'
import { CuponsService } from '../cupons/cupons.service'
import { TipoDesconto } from '../../models/cupons/cupom.interface'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private serv: PedidosService,
    private servServicos: ServicosService,
    private userService: UserService,
    private enderecoService: EnderecosService,
    private prestadorService: PrestadoresService,
    private clienteService: ClientesService,
    private firebaseNotification: FirebaseMessagingService,
    private cupomService: CuponsService,
    private mailManager: MailManager,
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
      data: moment()
        .utc()
        .toDate(),
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

    const endereco = await this.enderecoService.getByIdWithClienteAndPrestador(
      newPedido.endereco.id,
    )

    if (newPedido.emDomicilio) {
      if (!endereco.cliente || endereco.cliente.id !== newPedido.cliente.id) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'O endereço não corresponde ao cliente da requisição.',
        )
      }
    } else {
      if (
        !endereco.prestador ||
        endereco.prestador.id !== newPedido.prestador.id
      ) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'O endereço não corresponde ao prestador da requisição.',
        )
      }
    }

    newPedido.subtotal = 0
    const servicosCompletos = []
    for (const servicoId of newPedido.servicos) {
      const servico = await this.servServicos.getByIdWithPrestador(servicoId.id)
      newPedido.subtotal += servico.valor
      if (newPedido.emDomicilio) {
        newPedido.subtotal += servico.valorFrete
      }
      servicosCompletos.push(servico)
      if (servico.prestador.id !== newPedido.prestador.id) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'Os serviços deve pertencer ao mesmo prestador',
        )
      }

      if (
        (!servico.noEstabelecimento && !newPedido.emDomicilio) ||
        (!servico.delivery && newPedido.emDomicilio)
      ) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'Os serviços selecionados não suportam o local esclhido.',
        )
      }
    }

    const cupom = newPedido.cupom
    newPedido.total = newPedido.subtotal

    if (cupom) {
      const newCupom = await this.cupomService.validateCupomNormalById(cupom.id)
      await this.serv.hasUsedCupomByCliente(newPedido.cliente.id, newCupom.id)
      if (newCupom.valorMinimo > newPedido.subtotal) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'O valor do pedido muito baixo para o cupom.',
        )
      }
      if (newCupom.valorMaximo < newPedido.subtotal) {
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'O valor do pedido muito alto para o cupom.',
        )
      }
      newCupom.restantes -= 1
      newPedido.cupom = newCupom
      newPedido.total -=
        newCupom.tipoDesconto === TipoDesconto.PORCENTAGEM
          ? (newPedido.subtotal * newCupom.desconto) / 100
          : newCupom.desconto
    }

    if (newPedido.total < 0) {
      newPedido.total = 0
    }

    const pedido = await this.serv.create(newPedido)
    const prestador = await this.prestadorService.getByID(pedido.prestador.id)

    if (prestador.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Novo pedido para você!! 😁'
        newNotification.token = prestador.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (prestador.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Novo pedido para você!! 😁'
        newNotification.token = prestador.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

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

    const cliente = await this.clienteService.getByID(pedido.cliente.id)
    if (cliente.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu pedido foi aceito!! 😁'
        newNotification.token = cliente.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (cliente.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu pedido foi aceito!! 😁'
        newNotification.token = cliente.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

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

    const cliente = await this.clienteService.getByID(pedido.cliente.id)
    if (cliente.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu pedido está sendo feito!! 😁'
        newNotification.token = cliente.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (cliente.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu pedido está sendo feito!! 😁'
        newNotification.token = cliente.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

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

    const cliente = await this.clienteService.getByID(pedido.cliente.id)
    if (cliente.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu serviço foi finalizado!! 😁'
        newNotification.token = cliente.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (cliente.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu serviço foi finalizado!! 😁'
        newNotification.token = cliente.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

    try {
      const newServico = await this.servServicos.getByIdWithPrestador(
        pedido.servicos[pedido.servicos.length - 1].id,
      )
      this.mailManager.sendEmail(
        pedido.cliente.usuario.email,
        'Seu pedido foi concluído!',
        pedido,
        newServico,
      )
    } catch (error) {
      console.log(error)
    }

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

    const cliente = await this.clienteService.getByID(pedido.cliente.id)
    if (cliente.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title =
          'Seu serviço foi rejeitado. Peça novamente!! 😊'
        newNotification.token = cliente.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (cliente.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title =
          'Seu serviço foi rejeitado. Peça novamente!! 😊'
        newNotification.token = cliente.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

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

    const cliente = await this.clienteService.getByID(pedido.cliente.id)
    if (cliente.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title =
          'Seu serviço foi cancelado. Peça novamente!! 😊'
        newNotification.token = cliente.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (cliente.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title =
          'Seu serviço foi cancelado. Peça novamente!! 😊'
        newNotification.token = cliente.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

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

    const prestador = await this.prestadorService.getByID(pedido.prestador.id)
    if (prestador.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu serviço foi cancelado.'
        newNotification.token = prestador.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    } else if (prestador.usuario.tokenNotificacao) {
      try {
        const newNotification = Object.assign({}, DEFAULT_NOTIFICATION)
        newNotification.notification.title = 'Seu serviço foi cancelado.'
        newNotification.token = prestador.usuario.tokenNotificacao

        await this.firebaseNotification.send(newNotification)
      } catch (error) {}
    }

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
