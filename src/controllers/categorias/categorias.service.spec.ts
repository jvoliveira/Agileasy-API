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
    jest.resetAllMocks()
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

  it('should get categoria pai', async () => {
    const categorias = [{ descricao: 'Limpeza', catPai: null } as any]

    repo.find.mockResolvedValue([{ descricao: 'Limpeza', catPai: null } as any])
    await expect(service.getParents()).resolves.toStrictEqual(categorias)
    expect(repo.find).toHaveBeenCalledWith({
      where: { ativo: true, catPai: null },
    })
  })
})
