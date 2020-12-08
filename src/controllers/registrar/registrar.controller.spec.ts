import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
import { TipoStatus } from '../../models/usuarios/usuario.interface'
import { ClientesService } from '../clientes/clientes.service'
import { PrestadoresService } from '../prestadores/prestadores.service'
import { RegistrarController } from './registrar.controller'
import * as moment from 'moment-timezone'
import { UserService } from '../../common/services/user.service'

describe('RegistrarController', () => {
  let controller: RegistrarController
  const mockFirebaseUser = createMock<FirebaseAuthenticationService>()
  const mockPrestadorService = createMock<PrestadoresService>()
  const mockClienteService = createMock<ClientesService>()
  const mockUserService = createMock<UserService>()
  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrarController],
      providers: [
        {
          provide: PrestadoresService,
          useValue: mockPrestadorService,
        },
        {
          provide: ClientesService,
          useValue: mockClienteService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: FirebaseAuthenticationService,
          useValue: mockFirebaseUser,
        },
      ],
    }).compile()

    controller = module.get<RegistrarController>(RegistrarController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should be resolved registrar/parceiro', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: {
          nome: 'Vinicius picanco',
        },
      },
    }
    mockFirebaseUser.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)
    mockFirebaseUser.setCustomUserClaims.mockReturnThis()
    mockPrestadorService.create.mockResolvedValue({
      nome: 'Vinicius picanco',
    } as any)

    await expect(
      controller.registerParceiro({
        email: 'vimivini99@gmail.com',
        senha: '123456',
        nomePublico: 'V1pi',
        usuario: { nome: 'Vinicius' },
      } as any),
    ).resolves.toStrictEqual(shouldReturn)
    expect(mockFirebaseUser.createUser).toBeCalledWith({
      email: 'vimivini99@gmail.com',
      password: '123456',
      displayName: 'V1pi',
    })
  })

  it('should be check is registrado', async () => {
    mockUserService.isRegistred.mockResolvedValue(true)

    await expect(
      controller.checkIsRegistred('vimivini99@gmail.com'),
    ).resolves.toStrictEqual({
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        registrado: true,
      },
    })
  })

  it('should be throws registrar/parceiro', async () => {
    const shouldReturn = new AllException(TipoErro.ERROR_AO_SALVAR)
    mockFirebaseUser.deleteUser.mockReturnThis()
    mockFirebaseUser.setCustomUserClaims.mockReturnThis()
    mockFirebaseUser.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)
    mockPrestadorService.create.mockRejectedValue(shouldReturn)

    await expect(
      controller.registerParceiro({
        email: 'vimivini99@gmail.com',
        senha: '123456',
        nomePublico: 'V1pi',
        usuario: { nome: 'Vinicius' },
      } as any),
    ).rejects.toStrictEqual(shouldReturn)
    expect(mockFirebaseUser.createUser).toBeCalledWith({
      email: 'vimivini99@gmail.com',
      password: '123456',
      displayName: 'V1pi',
    })

    expect(mockFirebaseUser.deleteUser).toBeCalled()
  })

  it('should be resolved registrar/cliente', async () => {
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        cliente: {
          nome: 'Vinicius picanco',
        },
      },
    }
    mockFirebaseUser.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)
    mockFirebaseUser.setCustomUserClaims.mockReturnThis()
    mockClienteService.create.mockResolvedValue({
      nome: 'Vinicius picanco',
    } as any)

    await expect(
      controller.registerCliente({
        email: 'vimivini99@gmail.com',
        senha: '123456',
        nomePublico: 'V1pi',
        usuario: { nome: 'Vinicius' },
        endereco: {
          endereco: 'Benedito Nicolau',
        },
      } as any),
    ).resolves.toStrictEqual(shouldReturn)
    expect(mockFirebaseUser.createUser).toBeCalledWith({
      email: 'vimivini99@gmail.com',
      password: '123456',
      displayName: 'Vinicius',
    })
  })

  it('should be throws registrar/cliente', async () => {
    const shouldReturn = new AllException(TipoErro.ERROR_AO_SALVAR)
    mockFirebaseUser.deleteUser.mockReturnThis()
    mockFirebaseUser.setCustomUserClaims.mockReturnThis()
    mockFirebaseUser.createUser.mockResolvedValue({ uid: 'uid-valido' } as any)
    mockClienteService.create.mockRejectedValue(shouldReturn)

    await expect(
      controller.registerCliente({
        email: 'vimivini99@gmail.com',
        senha: '123456',
        nomePublico: 'V1pi',
        usuario: { nome: 'Vinicius' },
        endereco: {
          endereco: 'Benedito Nicolau',
        },
      } as any),
    ).rejects.toStrictEqual(shouldReturn)
    expect(mockFirebaseUser.createUser).toBeCalledWith({
      email: 'vimivini99@gmail.com',
      password: '123456',
      displayName: 'Vinicius',
    })

    expect(mockFirebaseUser.deleteUser).toBeCalled()
  })
})
