import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import configuration from './configuration'
import { PgModelsConfigService } from './config.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: `${process.env.NODE_ENV || 'development'}.env`,
      validationSchema: Joi.object({
        PASSWORD_BD: Joi.string().default('beribo'),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        HOST_BD: Joi.string().default('localhost'),
        PORT_BD: Joi.number().default(5432),
        NAME_BD: Joi.string().default('delivery'),
      }),
    }),
  ],
  providers: [ConfigService, PgModelsConfigService],
  exports: [ConfigService, PgModelsConfigService],
})
export class PgModelsConfigModule {}
