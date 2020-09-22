import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PgModelsConfigModule } from './config/database/postgresql/config.module'
import { AppConfigModule } from './config/app/config.module'
import { PgModelsConfigService } from './config/database/postgresql/config.service'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
