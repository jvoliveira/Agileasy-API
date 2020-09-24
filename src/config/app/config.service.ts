import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('app.host')
  }

  get port(): number {
    return Number(this.configService.get<string>('app.port'))
  }

  get env(): string {
    return this.configService.get<string>('app.env')
  }
}
