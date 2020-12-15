import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../common/services/user.service'
import { ClientesController } from './clientes.controller'
import { ClientesService } from './clientes.service'
import * as admin from 'firebase-admin'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { PrestadoresService } from '../prestadores/prestadores.service'

describe('ClientesController', () => {
  let controller: ClientesController
  const repo = createMock<ClientesService>()
  const userService = createMock<UserService>()
  const authService = createMock<FirebaseAuthenticationService>()
  const prestadorService = createMock<PrestadoresService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: repo,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: FirebaseAuthenticationService,
          useValue: authService,
        },
        {
          provide: PrestadoresService,
          useValue: prestadorService,
        },
      ],
    }).compile()

    controller = module.get<ClientesController>(ClientesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return all information', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente: {
          nome: 'Vinicius',
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({ id: 1 } as any)
    repo.getAllInformation.mockResolvedValue(shouldReturn.data.cliente as any)
    await expect(controller.getAllInformation(mockUser)).resolves.toStrictEqual(
      shouldReturn,
    )
  })

  it('should change notificacao', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getClienteByToken.mockResolvedValue({
      id: 1,
      usuario: { id: 1 },
    } as any)
    userService.update.mockResolvedValue({ id: 1 } as any)

    await expect(
      controller.changeTokenNotificacao(mockUser, {
        tokenNotificacao: 'TESTE',
      }),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
