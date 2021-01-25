import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { Cliente } from '../../models/clientes/cliente.entity'
import { ClientesService } from './clientes.service'
import { createMock } from '@golevelup/nestjs-testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('ClientesService', () => {
  let service: ClientesService
  const repo = createMock<Repository<Cliente>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<ClientesService>(ClientesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be get all information', async () => {
    const shouldReturn = [
      {
        descricao: 'Vinicius Picanco',
      },
    ]

    expect(service).toBeDefined()

    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    expect(await service.getAllInformation(1)).toBe(shouldReturn)
    expect(repo.findOneOrFail).toHaveBeenCalledWith(1, {
      relations: ['usuario', 'enderecos', 'cartoes'],
    })

    repo.findOneOrFail.mockClear()
    repo.findOneOrFail.mockRejectedValue(new Error())

    await expect(service.getAllInformation(1)).rejects.toThrow(Error)
  })
})
