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
})
