import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresService } from './prestadores.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../models/prestadores/prestador.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('Prestadores Service', () => {
  let service: PrestadoresService
  const repo = createMock<Repository<Prestador>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestadoresService,
        {
          provide: getRepositoryToken(Prestador),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<PrestadoresService>(PrestadoresService)
  })

  it('should be ok', async () => {
    expect(service).toBeDefined()
  })
})
