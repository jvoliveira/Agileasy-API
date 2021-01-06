import { Test, TestingModule } from '@nestjs/testing'
import { CieloConfigService } from './config.service'
import { CieloConfigModule } from './config.module'

jest.mock('dotenv')
jest.mock('fs')
describe('CieloConfigService', () => {
  let service: CieloConfigService

  beforeEach(async () => {
    process.env = {
      MERCHANT_ID: 'merchant_id',
      MERCHANT_KEY: 'merchant_key',
      SANDBOX: true as any,
      DEBUG: true as any,
    }
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CieloConfigModule],
    }).compile()

    service = moduleRef.get<CieloConfigService>(CieloConfigService)
  })

  it('should be read right values', () => {
    expect(service).toBeDefined()
    expect(service.merchantId).toBe('merchant_id')
    expect(service.merchantKey).toBe('merchant_key')
    expect(service.sandbox).toBe(true)
    expect(service.debug).toBe(true)
  })
})
