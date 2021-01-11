import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CieloConstructor } from 'cielo'
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class CieloConfigService {
  constructor(private configService: ConfigService) {}

  get merchantId(): string {
    return this.configService.get<string>('cielo.merchantId')
  }

  get merchantKey(): string {
    return this.configService.get<string>('cielo.merchantKey')
  }

  get zeroAuthUrl(): string {
    return this.sandbox
      ? 'https://apisandbox.cieloecommerce.cielo.com.br/1/zeroauth'
      : 'https://api.cieloecommerce.cielo.com.br/1/zeroauth'
  }

  get sandbox(): boolean {
    return this.configService.get<string>('cielo.sandbox') === 'true'
  }

  get debug(): boolean {
    return this.configService.get<string>('cielo.debug') === 'true'
  }

  get cieloParams(): CieloConstructor {
    return {
      merchantId: this.merchantId,
      merchantKey: this.merchantKey,
      sandbox: this.sandbox, // Opcional - Ambiente de Testes
      debug: this.debug,
    }
  }
}
