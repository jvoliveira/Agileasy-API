import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Servico } from '../../models/servicos/servico.entity'
import { ServicosService } from './servicos.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Repository } from 'typeorm'

describe('ServicosService', () => {
  let service: ServicosService
  const repo = createMock<Repository<Servico>>()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        {
          provide: getRepositoryToken(Servico),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<ServicosService>(ServicosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be get servicos with prestador', async () => {
    const shouldReturn = [
      {
        descricao: 'Vinicius Picanco',
      },
    ]

    expect(service).toBeDefined()

    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    expect(await service.getByIdWithPrestador(1)).toBe(shouldReturn)
    expect(repo.findOneOrFail).toHaveBeenCalledWith(1, {
      relations: ['prestador'],
    })

    repo.findOneOrFail.mockClear()
    repo.findOneOrFail.mockRejectedValue(new Error())

    await expect(service.getByIdWithPrestador(1)).rejects.toThrow(Error)
  })

  it('should list enderecos from cliente', async () => {
    const shouldReturn = [{ descricao: 'Vinicius' }]

    repo.find.mockResolvedValue(shouldReturn as any)

    repo.findOne.mockResolvedValue(shouldReturn as any)

    await expect(service.getServicoByPrestador(1)).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(repo.find).toHaveBeenCalledWith({
      where: { ativo: true, prestador: { id: 1 } },
    })
  })
})
