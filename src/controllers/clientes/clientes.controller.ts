import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'
import { ClientesService } from './clientes.service'
import { User } from '../../common/decorators/user.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { UpdateTokenDto } from './dto/update-token.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import * as moment from 'moment-timezone'
import { AllException } from '../../common/exceptions/all.exception'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { Claims } from '../../common/guards/interfaces/claims.interface'
import { Cliente } from '../../models/clientes/cliente.entity'
import { PrestadoresService } from '../prestadores/prestadores.service'

@Controller('clientes')
export class ClientesController {
  constructor(
    private serv: ClientesService,
    private userService: UserService,
    private auth: FirebaseAuthenticationService,
    private prestadorService: PrestadoresService,
  ) {}

  @Roles(TipoUsuario.CLIENTE)
  @Get('eu')
  public async getAllInformation(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    const cliente = await this.serv.getAllInformation(clienteIncompleto.id)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente,
      },
    }
  }

  @Patch('novo')
  @Roles(TipoUsuario.PRESTADOR)
  public async create(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const claims = user.customClaims as Claims
    const prestadorIncompleto = await this.userService.getPrestadorByToken(
      user.uid,
    )
    const prestador = await this.prestadorService.getPrestadorWithEndereco(
      prestadorIncompleto.id,
    )
    if (claims.roles.includes(TipoUsuario.CLIENTE)) {
      throw new AllException(TipoErro.USUARIO_JA_EXISTE)
    }

    try {
      claims.roles.push(TipoUsuario.PRESTADOR)
      await this.auth.setCustomUserClaims(user.uid, claims)

      const newCliente = new Cliente(
        0,
        prestador.usuario,
        [prestador.endereco],
        [],
        true,
      )

      delete prestador.endereco.id

      delete newCliente.id

      newCliente.criadoEm = moment()
        .utc()
        .toDate()

      const cliente = await this.serv.create(newCliente)
      return {
        error_id: TipoErro.SEM_ERROS,
        message: 'Sucesso!',
        error: false,
        data: {
          cliente,
        },
      }
    } catch (error) {
      claims.roles.pop()
      await this.auth.setCustomUserClaims(user.uid, claims)
      throw error
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Put('/atualizar/notificacao/eu')
  public async changeTokenNotificacao(
    @User() user: admin.auth.UserRecord,
    @Body() token: UpdateTokenDto,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)

    this.serv.update(clienteIncompleto.id, {
      tokenNotificacao: token.tokenNotificacao,
    })

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Put('/atualizar/dados-cadastrais/eu')
  public async changeAccountData(
    @User() user: admin.auth.UserRecord,
    @Body() usuario: UpdateClienteDto,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    if (!clienteIncompleto.usuario.cpf && usuario.cpf) {
      clienteIncompleto.usuario.cpf = usuario.cpf
    }

    if (!clienteIncompleto.usuario.dataNascimento && usuario.dataNascimento) {
      clienteIncompleto.usuario.dataNascimento = moment(
        usuario.dataNascimento,
      ).toDate()
    }

    if (usuario.telefone) {
      clienteIncompleto.usuario.telefone = usuario.telefone
    }

    if (usuario.sexo) {
      clienteIncompleto.usuario.sexo = usuario.sexo
    }

    this.userService.update(
      clienteIncompleto.usuario.id,
      clienteIncompleto.usuario,
    )

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente: clienteIncompleto,
      },
    }
  }
}
