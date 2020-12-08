import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { RegisterPrestadorDto } from './dto/register-parceiro.dto'
import {
  RegisterClienteDto,
  RegisterClienteSocialNetworkDto,
} from './dto/register-cliente.dto'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ClientesService } from '../clientes/clientes.service'
import { TipoStatus } from '../../models/usuarios/usuario.interface'
import * as moment from 'moment-timezone'
import { UserService } from '../../common/services/user.service'

@Controller('registrar')
export class RegistrarController {
  constructor(
    private servPrestador: PrestadoresService,
    private servCliente: ClientesService,
    private servUser: UserService,
    private firebaseAuth: FirebaseAuthenticationService,
  ) {}

  @Post('prestador')
  public async registerParceiro(
    @Body() registerPrestadorDto: RegisterPrestadorDto,
  ): Promise<ResponseDefault> {
    const user = await this.firebaseAuth.createUser({
      email: registerPrestadorDto.email,
      password: registerPrestadorDto.senha,
      displayName: registerPrestadorDto.nomePublico,
    })
    await this.firebaseAuth.setCustomUserClaims(user.uid, {
      roles: [TipoUsuario.PRESTADOR],
    })
    registerPrestadorDto.usuario.uid = user.uid
    registerPrestadorDto.usuario.status = TipoStatus.em_analise
    registerPrestadorDto.nota = -1
    registerPrestadorDto.taxa = 10
    registerPrestadorDto.criadoEm = moment()
      .utc()
      .toDate()
    registerPrestadorDto.usuario.email = registerPrestadorDto.email
    try {
      const prestador = await this.servPrestador.create(registerPrestadorDto)
      return {
        error_id: TipoErro.SEM_ERROS,
        message: 'Sucesso!',
        error: false,
        data: {
          prestador,
        },
      }
    } catch (error) {
      this.firebaseAuth.deleteUser(user.uid)
      throw error
    }
  }

  @Post('cliente')
  public async registerCliente(
    @Body() registerClienteDto: RegisterClienteDto,
  ): Promise<ResponseDefault> {
    const user = await this.firebaseAuth.createUser({
      email: registerClienteDto.email,
      password: registerClienteDto.senha,
      displayName: registerClienteDto.usuario.nome,
    })
    await this.firebaseAuth.setCustomUserClaims(user.uid, {
      roles: [TipoUsuario.CLIENTE],
    })
    registerClienteDto.usuario.uid = user.uid
    registerClienteDto.enderecos = [registerClienteDto.endereco]
    delete registerClienteDto.endereco
    registerClienteDto.criadoEm = moment()
      .utc()
      .toDate()
    registerClienteDto.usuario.email = registerClienteDto.email
    try {
      const cliente = await this.servCliente.create(registerClienteDto)
      return {
        error_id: TipoErro.SEM_ERROS,
        message: 'Sucesso!',
        error: false,
        data: {
          cliente,
        },
      }
    } catch (error) {
      this.firebaseAuth.deleteUser(user.uid)
      throw error
    }
  }

  @Get(':email/e-registrado')
  public async checkIsRegistred(
    @Param('email') email: string,
  ): Promise<ResponseDefault> {
    const isRegistred = await this.servUser.isRegistred(email)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        registrado: isRegistred,
      },
    }
  }

  @Post('cliente/redes-sociais')
  public async registerClienteBySocialNetwork(
    @Body() registerClienteDto: RegisterClienteSocialNetworkDto,
  ): Promise<ResponseDefault> {
    const user = await this.firebaseAuth.getUser(registerClienteDto.senha)
    await this.firebaseAuth.setCustomUserClaims(user.uid, {
      roles: [TipoUsuario.CLIENTE],
    })
    registerClienteDto.usuario.uid = user.uid
    registerClienteDto.enderecos = [registerClienteDto.endereco]
    delete registerClienteDto.endereco
    registerClienteDto.criadoEm = moment()
      .utc()
      .toDate()
    registerClienteDto.usuario.email = registerClienteDto.email
    try {
      const cliente = await this.servCliente.create(registerClienteDto)
      return {
        error_id: TipoErro.SEM_ERROS,
        message: 'Sucesso!',
        error: false,
        data: {
          cliente,
        },
      }
    } catch (error) {
      this.firebaseAuth.deleteUser(user.uid)
      throw error
    }
  }
}
