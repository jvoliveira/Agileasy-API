import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { User } from '../../common/decorators/user.decorator'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { UserService } from '../../common/services/user.service'
import { EnderecosService } from './enderecos.service'
import * as admin from 'firebase-admin'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { CreateEnderecoDto } from './dto/create-endereco.dto'
import { UpdateEnderecoDto } from './dto/update-endereco.dto'
import { AllException } from '../../common/exceptions/all.exception'

@Controller('enderecos')
export class EnderecosController {
  constructor(
    private serv: EnderecosService,
    private userService: UserService,
  ) {}

  @Roles(TipoUsuario.CLIENTE)
  @Get('cliente/eu')
  public async getEnderecosByCliente(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    const enderecos = await this.serv.getEnderecosByCliente(
      clienteIncompleto.id,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        enderecos,
      },
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Post('adicionar/cliente/eu')
  public async addEndereco(
    @User() user: admin.auth.UserRecord,
    @Body() createEnderecoDto: CreateEnderecoDto,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)
    createEnderecoDto.cliente = {
      id: clienteIncompleto.id,
    }
    const endereco = await this.serv.create(createEnderecoDto)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco,
      },
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Delete(':id/cliente/eu')
  public async removeEndereco(
    @User() user: admin.auth.UserRecord,
    @Param('id') id: number,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)

    const endereco = await this.serv.getByIdWithCliente(id)
    if (clienteIncompleto.id !== endereco.cliente.id) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }
    await this.serv.delete(id)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Put(':id/alterar/cliente/eu')
  public async updateEndereco(
    @User() user: admin.auth.UserRecord,
    @Param('id') id: number,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<ResponseDefault> {
    const clienteIncompleto = await this.userService.getClienteByToken(user.uid)

    const enderecoReceive = await this.serv.getByIdWithCliente(id)
    if (clienteIncompleto.id !== enderecoReceive.cliente.id) {
      throw new AllException(TipoErro.USUARIO_SEM_PERMISSAO)
    }

    const endereco = await this.serv.update(
      enderecoReceive.id,
      updateEnderecoDto,
    )
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco,
      },
    }
  }
}
