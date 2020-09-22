import { Module } from '@nestjs/common'
import { BaseModel } from './base.entity'

@Module({
  exports: [BaseModel],
})
export class BaseModelModule {}
