import { Controller, Post, Body } from '@nestjs/common'
import { RegisterPrestadorDto } from './dto/register-parceiro.dto'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { ResponseDefault } from '../common/interfaces/response-default.interface'
import { TipoErro } from '../common/enums/tipo-erro.enum'

@Controller('registrar')
export class RegistrarController {
  constructor(
    private servPrestador: PrestadoresService,
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
}
