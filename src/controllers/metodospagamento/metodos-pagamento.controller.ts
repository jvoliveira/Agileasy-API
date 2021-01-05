import { Body, Controller, Get, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum'
import { ResponseDefault } from '../../common/interfaces/response-default.interface'
import { MetodosPagamentoService } from './metodos-pagamento.service'
import { CreateMetodoPagamentoDto } from './dto/create-metodo-pagamento.dto'
import { TipoPagamento } from '../../models/metodos-pagamento/metodo-pagamento.interface'
import { UserService } from '../../common/services/user.service'
import { User } from '../../common/decorators/user.decorator'
import * as admin from 'firebase-admin'
import { Cielo, EnumBrands } from 'cielo'
import { CieloConfigService } from '../../config/cielo/config.service'

@Controller('metodos-pagamento')
export class MetodosPagamentoController {
  constructor(
    private serv: MetodosPagamentoService,
    private userService: UserService,
    private cieloService: CieloConfigService,
  ) {}
  @Roles(TipoUsuario.CLIENTE)
  @Get('comuns')
  public async getCommonsMetodosPagamento(): Promise<ResponseDefault> {
    const metodosPagamento = await this.serv.getAll()
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        metodosPagamento,
      },
    }
  }

  @Roles(TipoUsuario.CLIENTE)
  @Post('novo/cartao-credito')
  public async newMetodoPagamento(
    @Body() newMetodoPagamento: CreateMetodoPagamentoDto,
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const cliente = await this.userService.getClienteByToken(user.uid)
    newMetodoPagamento.cartao.cliente = { id: cliente.id }
    newMetodoPagamento.tipoPagamento = TipoPagamento.cartaoCreditoOnline
    const numberCartao = newMetodoPagamento.cartao.numero
    // Cadastrar na cielo
    const cartao = newMetodoPagamento.cartao
    const cielo = new Cielo(this.cieloService)
    const tokenize = await cielo.cartao.createTokenizedCard({
      brand: EnumBrands[cartao.bandeira.toUpperCase()],
      cardNumber: cartao.numero,
      customerName: cartao.nome,
      expirationDate:
        cartao.mes.padStart(2, '0') + '/' + cartao.ano.padStart(4, '20'),
      holder: cartao.nome,
    })

    newMetodoPagamento.cartao.token = tokenize.cardToken
    newMetodoPagamento.cartao.numero =
      'XXXX-XXXX-XXXX-' +
      numberCartao.substring(numberCartao.length - 4, numberCartao.length)
    const metodosPagamento = this.serv.create(newMetodoPagamento)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        metodosPagamento,
      },
    }
  }
}
