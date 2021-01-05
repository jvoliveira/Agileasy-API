import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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

  get sandbox(): boolean {
    return this.configService.get<boolean>('cielo.sandbox')
  }

  get debug(): boolean {
    return this.configService.get<boolean>('cielo.debug')
  }
}
