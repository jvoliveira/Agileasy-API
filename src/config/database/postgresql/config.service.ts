import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as path from 'path'
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class PgModelsConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('pg-models.name')
  }
  get password(): string {
    return this.configService.get<string>('pg-models.password')
  }
  get url(): string {
    return this.configService.get<string>('pg-models.url')
  }
  get port(): number {
    return Number(this.configService.get<number>('pg-models.port'))
  }

  get getTypeORMConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'beribo',
      database: 'delivery',
      synchronize: false,
      dropSchema: false,
      logging: false,
      retryAttempts: 3,
      autoLoadEntities: true,
      migrations: [path.join(__dirname, 'migrations', '**', '*{.ts,.js}')],
      subscribers: [path.join(__dirname, 'subscribers', '**', '*{.ts,.js}')],
      factories: [path.join(__dirname, 'factories', '**', '*{.ts,.js}')],
      cli: {
        migrationsDir: path.join(__dirname, 'migrations'),
        subscribersDir: path.join(__dirname, 'subscribers'),
        factoriesDir: path.join(__dirname, 'factories'),
      },
    } as any
  }
}
