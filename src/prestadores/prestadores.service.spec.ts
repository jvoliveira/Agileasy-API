import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresController } from './prestadores.controller'
import { PrestadoresService } from './prestadores.service'
import { PrestadoresEntityModule } from '../models/prestadores/prestadores.module'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../models/prestadores/prestador.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('PrestadoresController', () => {
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

  it('should be defined', async () => {
    const shouldReturn = [
      {
        nome: 'Vinicius Picanco',
      },
    ]
    expect(service).toBeDefined()

    repo.find.mockReturnValue(shouldReturn as any)

    expect(await service.getAll()).toBe(shouldReturn)
  })
})
