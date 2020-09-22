import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PgModelsConfigModule } from './config/database/postgresql/config.module'
import { AppConfigModule } from './config/app/config.module'
import { PgModelsConfigService } from './config/database/postgresql/config.service'
import { PrestadoresModule } from './prestadores/prestadores.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PgModelsConfigModule],
      inject: [PgModelsConfigService],
      useFactory: async (configService: PgModelsConfigService) =>
        configService.getTypeORMConfig,
    }),
    PgModelsConfigModule,
    AppConfigModule,
    PrestadoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
