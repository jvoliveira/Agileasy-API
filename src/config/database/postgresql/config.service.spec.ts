import { Test, TestingModule } from '@nestjs/testing'
import { PgModelsConfigService } from './config.service'
import { PgModelsConfigModule } from './config.module'

jest.mock('dotenv')
jest.mock('fs')
describe('PgModelsConfigService', () => {
  let service: PgModelsConfigService

  beforeEach(async () => {
    process.env = {
      PASSWORD_BD: 'beribo',
      NAME_BD: 'delivery',
      HOST_BD: '0.0.0.0',
      PORT_BD: '5432',
    }
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PgModelsConfigModule],
    }).compile()

    service = moduleRef.get<PgModelsConfigService>(PgModelsConfigService)
  })

  it('should be read right values', () => {
    expect(service).toBeDefined()
    expect(service.databaseName).toBe('delivery')
    expect(service.port).toBe(5432)
    expect(service.password).toBe('beribo')
    expect(service.host).toBe('0.0.0.0')
  })
})
