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
        POSTGRES_PASSWORD: Joi.string().default('beribo'),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        POSTGRES_HOST: Joi.string().default('localhost'),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_DB: Joi.string().default('delivery'),
        POSTGRES_USER: Joi.string().default('postgres'),
      }),
    }),
  ],
  providers: [ConfigService, PgModelsConfigService],
  exports: [ConfigService, PgModelsConfigService],
})
export class PgModelsConfigModule {}
