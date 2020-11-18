import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresService } from './prestadores.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../../models/prestadores/prestador.entity'
import { Repository } from 'typeorm'
import { PrestadoresController } from './prestadores.controller'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RequestAuth } from '../../common/interfaces/request-auth.interface'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'

describe('Prestadores Service', () => {
  let service: PrestadoresService
  const mockFirebaseUser = createMock<FirebaseAuthenticationService>()
  let controller: PrestadoresController
  const repo = createMock<Repository<Prestador>>()
  const userService = createMock<UserService>()
  const defaultResponse = {
    data: {},
    error: false,
    error_id: TipoErro.SEM_ERROS,
    message: 'Sucesso!',
  }

  const mockService = createMock<PrestadoresService>()

  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestadoresController],
      providers: [
        {
          provide: PrestadoresService,
          useValue: mockService,
        },
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: getRepositoryToken(Prestador),
          useValue: repo,
        },
        {
          provide: FirebaseAuthenticationService,
          useValue: mockFirebaseUser,
        },
      ],
    }).compile()
    service = module.get<PrestadoresService>(PrestadoresService)
    controller = module.get<PrestadoresController>(PrestadoresController)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
    expect(controller).toBeDefined()
  })

  it('should return all prestadores', async () => {
    const getAllResponse = defaultResponse
    getAllResponse.data = {
      prestadores: [{ nome: 'Vinicius' }],
    }
    jest
      .spyOn(service, 'getAll')
      .mockImplementation(() => getAllResponse.data['prestadores'])
    await expect(controller.getAll()).resolves.toStrictEqual(getAllResponse)
  })

  it('should return all prestadores with categoria', async () => {
    const getAllResponse = defaultResponse
    getAllResponse.data = {
      prestadores: [{ nome: 'Vinicius' }],
    }
    jest
      .spyOn(service, 'getPrestadoresWithCategoria')
      .mockImplementation(() => getAllResponse.data['prestadores'])
    await expect(
      controller.getPrestadoresWithCategorias(),
    ).resolves.toStrictEqual(getAllResponse)
  })

  it('should return all prestadores by categoria', async () => {
    const getAllResponse = defaultResponse
    getAllResponse.data = {
      prestadores: [{ nome: 'Vinicius' }],
    }
    jest
      .spyOn(service, 'getPrestadorByCategoria')
      .mockImplementation(() => getAllResponse.data['prestadores'])
    await expect(controller.getPrestadorByCategoria(1)).resolves.toStrictEqual(
      getAllResponse,
    )
  })

  it('should return prestador by id', async () => {
    const getByIDResponse = defaultResponse
    getByIDResponse.data = {
      prestador: { nome: 'Vinicius' },
    }
    jest
      .spyOn(service, 'getByID')
      .mockImplementation(() => getByIDResponse.data['prestador'])
    await expect(controller.get(1)).resolves.toStrictEqual(getByIDResponse)
  })

  it('should create prestador', async () => {
    mockFirebaseUser.setCustomUserClaims.mockResolvedValue()
    const createResponse = defaultResponse
    createResponse.data = {
      prestador: {
        id: 1,
        nome: 'Vinicius',
        usuario: { id: 1, cpf: '133.568.145-56' },
      },
    }
    const mockRequest = createMock<RequestAuth>()
    mockRequest.user = {
      uid: 'oi',
      customClaims: { roles: [200] },
    } as any

    jest
      .spyOn(service, 'create')
      .mockImplementation(() => createResponse.data['prestador'])
    await expect(
      controller.create(
        {
          nome: 'Vinicius',
          usuario: { cpf: '133.568.145-56' },
        } as any,
        mockRequest.user,
      ),
    ).resolves.toStrictEqual(createResponse)
    expect(service.create).toBeCalledWith({
      nome: 'Vinicius',
      usuario: { cpf: '133.568.145-56', uid: 'oi' },
    })
  })

  it('should add categoria prestador as admin', async () => {
    mockFirebaseUser.setCustomUserClaims.mockResolvedValue()
    const createResponse = defaultResponse
    createResponse.data = {
      prestador: {
        id: 1,
        nome: 'Vinicius',
        usuario: { id: 1, cpf: '133.568.145-56' },
      },
    }
    jest
      .spyOn(service, 'addCategoria')
      .mockImplementation(() => createResponse.data['prestador'])
    await expect(
      controller.addCategoriaAsAdmin(1, { categorias: [1, 2] }),
    ).resolves.toStrictEqual(createResponse)
    expect(service.addCategoria).toBeCalledWith(1, [1, 2])
  })

  it('should add servico prestador', async () => {
    mockFirebaseUser.setCustomUserClaims.mockResolvedValue()
    const createResponse = defaultResponse
    createResponse.data = {
      prestador: {
        id: 1,
        nome: 'Vinicius',
        usuario: { id: 1, cpf: '133.568.145-56' },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    jest
      .spyOn(service, 'addServicos')
      .mockImplementation(() => createResponse.data['prestador'])
    await expect(
      controller.addServicos(
        {
          servicos: [
            {
              descricao: 'legal',
              nome: 'Vinicius Picanco',
              urlFoto: 'url',
              valor: 52.36,
            },
          ],
        },
        mockUser,
      ),
    ).resolves.toStrictEqual(createResponse)
    expect(service.addServicos).toBeCalledWith(1, [
      {
        descricao: 'legal',
        nome: 'Vinicius Picanco',
        urlFoto: 'url',
        valor: 52.36,
      },
    ])
  })

  it('should add categoria prestador', async () => {
    mockFirebaseUser.setCustomUserClaims.mockResolvedValue()
    const createResponse = defaultResponse
    createResponse.data = {
      prestador: {
        id: 1,
        nome: 'Vinicius',
        usuario: { id: 1, cpf: '133.568.145-56' },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    jest
      .spyOn(service, 'addCategoria')
      .mockImplementation(() => createResponse.data['prestador'])
    await expect(
      controller.addCategoria({ categorias: [1, 2] }, mockUser),
    ).resolves.toStrictEqual(createResponse)
    expect(service.addCategoria).toBeCalledWith(1, [1, 2])
  })

  it('should return Prestador with Servicos', async () => {
    const prestador = { nome: 'Vinicius' }
    mockService.getServicosByPrestador.mockResolvedValue(prestador as any)

    defaultResponse.data = { prestador }
    expect(controller.getServicos(1)).resolves.toStrictEqual(defaultResponse)
  })

  it('should return all information', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        prestador: {
          nome: 'Vinicius',
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    jest
      .spyOn(service, 'getAllInformation')
      .mockImplementation(() => shouldReturn.data.prestador as any)
    await expect(controller.getAllInformation(mockUser)).resolves.toStrictEqual(
      shouldReturn,
    )
  })
})
