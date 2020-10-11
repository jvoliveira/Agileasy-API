import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Categoria } from '../models/categorias/categoria.entity'
import { CategoriasService } from './categorias.service'

describe('CategoriasService', () => {
  let service: CategoriasService
  const repo = createMock<Repository<Categoria>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<CategoriasService>(CategoriasService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
