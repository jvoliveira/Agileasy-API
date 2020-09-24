import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin'
import { PgModelsConfigModule } from './config/database/postgresql/config.module'
import { AppConfigModule } from './config/app/config.module'
import { PgModelsConfigService } from './config/database/postgresql/config.service'
import { PrestadoresModule } from './prestadores/prestadores.module'
import { RolesGuard } from './common/guards/roles.guard'
import * as admin from 'firebase-admin'
import { FIREBASE_CONFIG } from './common/constants/firebase'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PgModelsConfigModule],
      inject: [PgModelsConfigService],
      useFactory: async (configService: PgModelsConfigService) =>
        configService.getTypeORMConfig,
    }),
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(FIREBASE_CONFIG),
      }),
    }),
    PgModelsConfigModule,
    AppConfigModule,
    PrestadoresModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
