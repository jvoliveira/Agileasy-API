import { Test, TestingModule } from '@nestjs/testing'
import { EnderecosController } from './enderecos.controller'
import { EnderecosService } from './enderecos.service'
import { createMock } from '@golevelup/nestjs-testing'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'

describe('EnderecosController', () => {
  let controller: EnderecosController
  const repo = createMock<EnderecosService>()
  const userService = createMock<UserService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnderecosController],
      providers: [
        {
          provide: EnderecosService,
          useValue: repo,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile()

    controller = module.get<EnderecosController>(EnderecosController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return all enderecos from cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        enderecos: [
          {
            endereco: 'Rua alabrasto',
          },
        ],
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    repo.getEnderecosByCliente.mockResolvedValue(
      shouldReturn.data.enderecos as any,
    )
    await expect(
      controller.getEnderecosByCliente(mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should adicionar enderecos from cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco: {
          apelido: 'Casa',
          endereco: 'Rua Benedito Nicolau',
          complemento: 'interfone 30',
          numero: '123',
          cidade: 'Itaperuna',
          estado: 'RJ',
          cep: '28300-000',
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    repo.create.mockResolvedValue(shouldReturn.data.endereco as any)
    await expect(
      controller.addEndereco(mockUser, shouldReturn.data.endereco),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should alterar endereco from cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco: {
          apelido: 'Casa',
          endereco: 'Rua Benedito Nicolau',
          complemento: 'interfone 30',
          numero: '123',
          cidade: 'Itaperuna',
          estado: 'RJ',
          cep: '28300-000',
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    repo.getByIdWithClienteAndPrestador.mockResolvedValue({
      id: 1,
      cliente: { id: 1 },
    } as any)
    repo.update.mockResolvedValue(shouldReturn.data.endereco as any)
    await expect(
      controller.updateEndereco(mockUser, 1, shouldReturn.data.endereco),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should mark as favorite endereco from cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        endereco: {
          id: 1,
          apelido: 'Casa',
          endereco: 'Rua Benedito Nicolau',
          complemento: 'interfone 30',
          numero: '123',
          cidade: 'Itaperuna',
          estado: 'RJ',
          cep: '28300-000',
          favorito: true,
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    repo.getByIdWithClienteAndPrestador.mockResolvedValue({
      id: 1,
      cliente: { id: 1 },
    } as any)
    repo.getEnderecosByCliente.mockResolvedValue([
      shouldReturn.data.endereco,
    ] as any)
    repo.update.mockResolvedValue(shouldReturn.data.endereco as any)
    repo.bulkUpdate.mockReturnThis()
    await expect(controller.markAsFavorito(mockUser, 1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })

  it('should delete endereco from cliente', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    repo.getByIdWithClienteAndPrestador.mockResolvedValue({
      id: 1,
      cliente: { id: 1 },
    } as any)
    repo.delete.mockResolvedValue(shouldReturn.data as any)
    await expect(controller.removeEndereco(mockUser, 1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })
})
