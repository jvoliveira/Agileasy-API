import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import configuration from './configuration'
import { AppConfigService } from './config.service'
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
        HOST: Joi.string().default('localhost'),
        PORT: Joi.number().default(5432),
        NODE_ENV: Joi.string().default('development'),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
