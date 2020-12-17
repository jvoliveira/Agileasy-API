import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/nestjs-testing'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Usuario } from '../../models/usuarios/usuario.entity'
import { UserService } from './user.service'

describe('Prestadores Service', () => {
  let service: UserService
  const repo = createMock<Repository<Usuario>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: repo,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })

  it('should get prestador by token', async () => {
    const shouldReturn = { nome: 'Vinicius' }

    repo.findOne.mockReturnValue({ prestador: { nome: 'Vinicius' } } as any)

    await expect(service.getPrestadorByToken('oid')).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { uid: 'oid' },
      relations: ['prestador'],
    })
  })

  it('should is registred', async () => {
    repo.findOne.mockReturnValue({ prestador: { nome: 'Vinicius' } } as any)

    await expect(
      service.isRegistred('vimivini99@gmail.com'),
    ).resolves.toStrictEqual(true)

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: 'vimivini99@gmail.com' },
    })
  })

  it('should get cliente by token', async () => {
    const shouldReturn = { nome: 'Vinicius' }

    repo.findOne.mockReturnValue({ cliente: { nome: 'Vinicius' } } as any)

    await expect(service.getClienteByToken('oid')).resolves.toStrictEqual(
      shouldReturn,
    )

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { uid: 'oid' },
      relations: ['cliente'],
    })
  })
})
