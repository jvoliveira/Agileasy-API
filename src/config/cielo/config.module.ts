import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import configuration from './configuration'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CieloConfigService } from './config.service'
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
        MERCHANT_ID: Joi.string().default('merchant_id'),
        MERCHANT_KEY: Joi.number().default('merchant_key'),
        SANDBOX: Joi.string().default(true),
        DEBUG: Joi.string().default(true),
      }),
    }),
  ],
  providers: [ConfigService, CieloConfigService],
  exports: [ConfigService, CieloConfigService],
})
export class AppConfigModule {}
