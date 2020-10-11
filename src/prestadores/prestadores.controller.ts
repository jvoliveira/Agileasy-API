import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { Roles } from '../common/decorators/roles.decorator'
import { CreatePrestadorDto } from './dto/create-prestador.dto'
import { AddCategoriaDto } from './dto/add-categoria.dto'
import { ResponseDefault } from '../common/interfaces/response-default.interface'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../common/enums/tipo-usuario.enum'
import { User } from '../common/decorators/user.decorator'
import * as admin from 'firebase-admin'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { Claims } from '../common/guards/interfaces/claims.interface'
import { AllException } from '../common/exceptions/all.exception'

@Controller('prestadores')
export class PrestadoresController {
  constructor(
    private serv: PrestadoresService,
    private auth: FirebaseAuthenticationService,
  ) {}

  @Get()
  @Roles(0, 200)
  public async getAll(): Promise<ResponseDefault> {
    const prestadores = await this.serv.getAll()
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores,
      },
    }
  }

  @Get(':id')
  public async get(@Param('id') id: number): Promise<ResponseDefault> {
    const prestador = await this.serv.getByID(id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }

  @Get(':id/categoria')
  public async getPrestadorByCategoria(
    @Param('id') id: number,
  ): Promise<ResponseDefault> {
    const prestadores = await this.serv.getPrestadorByCategoria(id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores,
      },
    }
  }

  @Post('criar')
  public async create(
    @Body() createPrestadorDto: CreatePrestadorDto,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    createPrestadorDto.usuario.token = user.uid
    const claims = user.customClaims as Claims
    if (claims.roles.includes(TipoUsuario.PRESTADOR)) {
      throw new AllException(TipoErro.USUARIO_JA_EXISTE)
    }
    claims.roles.push(TipoUsuario.PRESTADOR)
    await this.auth.setCustomUserClaims(user.uid, claims)

    const prestador = await this.serv.create(createPrestadorDto)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }

  @Post(':id/adicionar_categorias')
  public async addCategoria(
    @Param('id') id: number,
    @Body() addCategoriasDto: AddCategoriaDto,
  ): Promise<ResponseDefault> {
    const prestador = await this.serv.addCategoria(
      id,
      addCategoriasDto.categorias,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }
}
