import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresService } from './prestadores.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../models/prestadores/prestador.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AllException } from '../common/exceptions/all.exception'

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

  it('should be get all', async () => {
    const shouldReturn = [
      {
        nome: 'Vinicius Picanco',
      },
    ]
    expect(service).toBeDefined()

    repo.find.mockReturnValue(shouldReturn as any)

    expect(await service.getAll()).toBe(shouldReturn)

    repo.find.mockClear()
    repo.find.mockReturnValue(null)

    expect(service.getAll()).rejects.toThrowError(AllException)
  })

  it('should be by id', async () => {
    const shouldReturn = {
      nome: 'Vinicius Picanco',
    }

    expect(service).toBeDefined()

    repo.findOne.mockReturnValue(shouldReturn as any)

    expect(await service.getByID(1)).toBe(shouldReturn)

    repo.findOne.mockClear()
    repo.findOne.mockReturnValue(null)

    expect(service.getByID(1)).rejects.toThrowError(AllException)
  })
})
