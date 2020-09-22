import { Module } from '@nestjs/common'
import { JsonHelper } from './json.helper'

@Module({
  exports: [JsonHelper],
})
export class JsonHelperModule {}
