import { Test, TestingModule } from '@nestjs/testing'
import { AppConfigService } from './config.service'
import { AppConfigModule } from './config.module'

jest.mock('dotenv')
jest.mock('fs')
describe('AppConfigService', () => {
  let service: AppConfigService

  beforeEach(async () => {
    process.env = {
      HOST: 'localhost',
      PORT: '2503',
      NODE_ENV: 'production',
    }
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
    }).compile()

    service = moduleRef.get<AppConfigService>(AppConfigService)
  })

  it('should be read right values', () => {
    expect(service).toBeDefined()
    expect(service.port).toBe(2503)
    expect(service.host).toBe('localhost')
    expect(service.env).toBe('production')
  })
})
