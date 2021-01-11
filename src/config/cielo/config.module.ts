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
        MERCHANT_ID: Joi.string().default(
          '71c8cba2-2121-4702-ad23-1bdfbc6548f3',
        ),
        MERCHANT_KEY: Joi.string().default(
          'RQAGSDIIMZKZQQHPTXTTOLITDEDXWDUGAIPXDHFE',
        ),
        SANDBOX: Joi.boolean().default(true),
        DEBUG: Joi.boolean().default(true),
      }),
    }),
  ],
  providers: [ConfigService, CieloConfigService],
  exports: [ConfigService, CieloConfigService],
})
export class CieloConfigModule {}
