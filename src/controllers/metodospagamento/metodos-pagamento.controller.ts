import { Body, Controller, Get, HttpService, Post } from '@nestjs/common'
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
import { AllException } from '../../common/exceptions/all.exception'

@Controller('metodos-pagamento')
export class MetodosPagamentoController {
  constructor(
    private serv: MetodosPagamentoService,
    private userService: UserService,
    private cieloService: CieloConfigService,
    private httpService: HttpService,
  ) {}
  @Roles(TipoUsuario.CLIENTE)
  @Get('comuns')
  public async getCommonsMetodosPagamento(): Promise<ResponseDefault> {
    const metodosPagamento = await this.serv.commons()
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
  @Get('cartoes/cliente/eu')
  public async getCartoes(
    @User() user: admin.auth.UserRecord,
  ): Promise<ResponseDefault> {
    const cliente = await this.userService.getClienteByToken(user.uid)
    const metodosPagamento = await this.serv.getCartoes(cliente.id)
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
    const cartao = newMetodoPagamento.cartao
    const cielo = new Cielo(this.cieloService.cieloParams)
    const cardBody = {
      brand: EnumBrands[cartao.bandeira.toUpperCase()],
      cardNumber: cartao.numero,
      customerName: cartao.nome,
      expirationDate:
        cartao.mes.padStart(2, '0') + '/' + cartao.ano.padStart(4, '20'),
      holder: cartao.nome,
    }

    let cardToken = ''

    if (
      cardBody.brand === EnumBrands.VISA ||
      cardBody.brand === EnumBrands.MASTER ||
      cardBody.brand === EnumBrands.ELO
    ) {
      try {
        const response = await this.httpService
          .post(
            this.cieloService.zeroAuthUrl,
            {
              ...cardBody,
              SaveCard: true,
            },
            {
              headers: {
                merchantId: this.cieloService.merchantId,
                merchantKey: this.cieloService.merchantKey,
                sandbox: this.cieloService.sandbox,
              },
            },
          )
          .toPromise()
        if (response.data.Valid) {
          cardToken = response.data.CardToken
        } else {
          throw new AllException(
            TipoErro.DADOS_INVALIDOS,
            response.data.ReturnMessage,
          )
        }
      } catch (error) {
        if (error instanceof AllException) {
          throw error
        }
        throw new AllException(
          TipoErro.DADOS_INVALIDOS,
          'Não foi possível verificar o cartão. Confira os dados e tente novamente.',
        )
      }
    } else {
      const tokenize = await cielo.card.createTokenizedCard(cardBody)
      cardToken = tokenize.cardToken
    }
    newMetodoPagamento.cartao.token = cardToken
    newMetodoPagamento.cartao.numero =
      'XXXX-XXXX-XXXX-' +
      numberCartao.substring(numberCartao.length - 4, numberCartao.length)
    const metodoPagamento = await this.serv.create(newMetodoPagamento)
    return {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: metodoPagamento,
    }
  }
}
