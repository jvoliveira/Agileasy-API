import { Controller, Get, Post, Body, Param, CacheTTL } from '@nestjs/common'
import { PrestadoresService } from './prestadores.service'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserService } from '../../common/services/user.service'
import { CreatePrestadorDto } from './dto/create-prestador.dto'
import { AddCategoriaDto } from './dto/add-categoria.dto'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { User } from '../../common/decorators/user.decorator'
import * as admin from 'firebase-admin'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { Claims } from '../../common/guards/interfaces/claims.interface'
import { AllException } from '../../common/exceptions/all.exception'

@Controller('prestadores')
export class PrestadoresController {
  constructor(
    private serv: PrestadoresService,
    private auth: FirebaseAuthenticationService,
    private userService: UserService,
  ) {}
  /** Rotas para nível cliente */
  @Get()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.CLIENTE)
  @CacheTTL(600)
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

  @Get('categorias')
  @Roles(0, 200)
  @CacheTTL(600)
  public async getPrestadoresWithCategorias(): Promise<ResponseDefault> {
    const prestadores = await this.serv.getPrestadoresWithCategoria()
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestadores,
      },
    }
  }

  @Get(':id/informacoes')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.CLIENTE)
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
  @Roles(TipoUsuario.ADMIN, TipoUsuario.CLIENTE)
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
  @Roles(TipoUsuario.ADMIN, TipoUsuario.CLIENTE)
  public async create(
    @Body() createPrestadorDto: CreatePrestadorDto,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    createPrestadorDto.usuario.uid = user.uid
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

  @Roles(TipoUsuario.CLIENTE)
  @Get(':id/servicos')
  public async getServicos(@Param('id') id: number): Promise<ResponseDefault> {
    const prestador = await this.serv.getServicosByPrestador(id)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador,
      },
    }
  }

  /** Rotas para nível administrador */
  @Roles(TipoUsuario.ADMIN)
  @Post(':id/adicionar/categorias')
  public async addCategoriaAsAdmin(
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

  /** Rotas para nível prestador */
  @Roles(TipoUsuario.PRESTADOR)
  @Post('adicionar/categorias')
  public async addCategoria(
    @Body() addCategoriasDto: AddCategoriaDto,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const prestadorFull = await this.userService.getPrestadorByToken(user.uid)
    const id = prestadorFull.id
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

  @Roles(TipoUsuario.PRESTADOR)
  @Get('/eu')
  public async getAllInformation(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getPrestadorByToken(
      user.uid,
    )
    const prestador = await this.serv.getAllInformation(clienteIncompleto.id)

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
