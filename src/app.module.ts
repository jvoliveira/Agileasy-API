import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter'
import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  ValidationPipe,
  CacheModule,
  CacheInterceptor,
} from '@nestjs/common'
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
import { AuthMiddleware } from './common/middlewares/auth.middleware'
import { RegistrarModule } from './registrar/registrar.module'
import { CategoriasModule } from './categorias/categorias.module'
import { ServicosModule } from './servicos/servicos.module'
import { PedidosModule } from './pedidos/pedidos.module'
import { EnderecosModule } from './enderecos/enderecos.module'
import { ClientesModule } from './clientes/clientes.module'

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
    CacheModule.register({
      ttl: 600, // seconds
      max: 10, // maximum number of items in cache
    }),
    PgModelsConfigModule,
    AppConfigModule,
    PrestadoresModule,
    RegistrarModule,
    CategoriasModule,
    ServicosModule,
    PedidosModule,
    EnderecosModule,
    ClientesModule,
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
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('registrar')
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
