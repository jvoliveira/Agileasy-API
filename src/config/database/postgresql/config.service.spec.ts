import { Test, TestingModule } from '@nestjs/testing'
import { PgModelsConfigService } from './config.service'
import { PgModelsConfigModule } from './config.module'

jest.mock('dotenv')
jest.mock('fs')
describe('PgModelsConfigService', () => {
  let service: PgModelsConfigService

  beforeEach(async () => {
    process.env = {
      POSTGRES_PASSWORD: 'beribo',
      POSTGRES_DB: 'delivery',
      POSTGRES_HOST: '0.0.0.0',
      POSTGRES_PORT: '5432',
      POSTGRES_USER: 'postgres',
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
    expect(service.user).toBe('postgres')
  })
})
