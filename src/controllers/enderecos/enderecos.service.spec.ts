import { Test, TestingModule } from '@nestjs/testing'
import { RelationQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm'
import { Endereco } from '../../models/enderecos/endereco.entity'
import { EnderecosService } from './enderecos.service'
import { createMock } from '@golevelup/nestjs-testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Cliente } from '../../models/clientes/cliente.entity'

describe('EnderecosService', () => {
  let service: EnderecosService
  const repo = createMock<Repository<Endereco>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnderecosService,
        {
          provide: getRepositoryToken(Endereco),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<EnderecosService>(EnderecosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be get endereco with cliente', async () => {
    const shouldReturn = [
      {
        descricao: 'Vinicius Picanco',
      },
    ]

    expect(service).toBeDefined()

    repo.findOneOrFail.mockReturnValue(shouldReturn as any)

    expect(await service.getByIdWithCliente(1)).toBe(shouldReturn)
    expect(repo.findOneOrFail).toHaveBeenCalledWith(1, {
      relations: ['cliente'],
    })

    repo.findOneOrFail.mockClear()
    repo.findOneOrFail.mockRejectedValue(new Error())

    await expect(service.getByIdWithCliente(1)).rejects.toThrow(Error)
  })

  it('should list enderecos from cliente', async () => {
    const shouldReturn = [{ nome: 'Vinicius' }]

    repo.find.mockResolvedValue(shouldReturn as any)

    repo.findOne.mockResolvedValue(shouldReturn as any)

    await expect(service.getEnderecosByCliente(1)).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(repo.find).toHaveBeenCalledWith({
      where: { ativo: true, cliente: 1 },
    })
  })
})
