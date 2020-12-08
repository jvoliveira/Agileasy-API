import { Test, TestingModule } from '@nestjs/testing'
import { CuponsService } from './cupons.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Repository } from 'typeorm'
import { Cupom } from '../../models/cupons/cupom.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('CuponsService', () => {
  let service: CuponsService
  const mockRepository = createMock<Repository<Cupom>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuponsService,
        {
          provide: getRepositoryToken(Cupom),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<CuponsService>(CuponsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
