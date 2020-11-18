import { Controller, Post, Body } from '@nestjs/common'
import { RegisterPrestadorDto } from './dto/register-parceiro.dto'
import { RegisterClienteDto } from './dto/register-cliente.dto'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ClientesService } from '../clientes/clientes.service'

@Controller('registrar')
export class RegistrarController {
  constructor(
    private servPrestador: PrestadoresService,
    private servCliente: ClientesService,
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
      roles: [TipoUsuario.CLIENTE],
    })
    registerPrestadorDto.usuario.token = user.uid
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
    @Body() registerPrestadorDto: RegisterClienteDto,
  ): Promise<ResponseDefault> {
    const user = await this.firebaseAuth.createUser({
      email: registerPrestadorDto.email,
      password: registerPrestadorDto.senha,
      displayName: registerPrestadorDto.usuario.nome,
    })
    await this.firebaseAuth.setCustomUserClaims(user.uid, {
      roles: [TipoUsuario.CLIENTE],
    })
    registerPrestadorDto.usuario.token = user.uid
    registerPrestadorDto.enderecos = [registerPrestadorDto.endereco]
    delete registerPrestadorDto.endereco
    try {
      const cliente = await this.servCliente.create(registerPrestadorDto)
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
