import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { CuponsService } from './cupons.service'
import { CreateCupomDto } from './dto/create-cupom.dto'
import * as moment from 'moment-timezone'
import { UserService } from '../../common/services/user.service'
import { User } from '../../common/decorators/user.decorator'
import * as admin from 'firebase-admin'
import { PedidosService } from '../pedidos/pedidos.service'

@Controller('cupons')
export class CuponsController {
  constructor(
    private service: CuponsService,
    private userService: UserService,
    private pedidoService: PedidosService,
  ) {}
  @Post('novo')
  @Roles(TipoUsuario.ADMIN)
  public async createNewCupom(
    @Body() createCupomDto: CreateCupomDto,
  ): Promise<ResponseDefault> {
    createCupomDto.ativo = true
    createCupomDto.validade = moment(createCupomDto.validade)
      .utc()
      .format()

    const cupom = await this.service.create(createCupomDto)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cupom,
      },
    }
  }

  @Patch(':codigo/validar/cliente/eu')
  @Roles(TipoUsuario.CLIENTE)
  public async validateCupomNormal(
    @User() user: admin.auth.UserRecord,
    @Param('codigo') codigo: string,
  ): Promise<ResponseDefault> {
    // Pegamos o cliente logado
    const cliente = await this.userService.getClienteByToken(user.uid)

    // Verificar se é um cupom válida
    const cupom = await this.service.validateCupomNormal(codigo)

    // Verificar se o cliente pode usar esse cupom
    await this.pedidoService.hasUsedCupomByCliente(cliente.id, cupom.id)

    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cupom,
      },
    }
  }
}
