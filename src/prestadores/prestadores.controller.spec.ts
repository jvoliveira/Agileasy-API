import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresService } from './prestadores.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Prestador } from '../models/prestadores/prestador.entity'
import { Repository } from 'typeorm'
import { PrestadoresController } from './prestadores.controller'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RequestAuth } from '../common/interfaces/request-auth.interface'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'

describe('Prestadores Service', () => {
  let service: PrestadoresService
  const mockFirebaseUser = createMock<FirebaseAuthenticationService>()
  let constroller: PrestadoresController
  const repo = createMock<Repository<Prestador>>()
  const defaultResponse = {
    data: {},
    error: false,
    error_id: TipoErro.SEM_ERROS,
    message: 'Sucesso!',
  }

  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestadoresController],
      providers: [
        PrestadoresService,
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
    constroller = module.get<PrestadoresController>(PrestadoresController)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
    expect(constroller).toBeDefined()
  })

  it('should return all prestadores', async () => {
    const getAllResponse = defaultResponse
    getAllResponse.data = {
      prestadores: [{ nome: 'Vinicius' }],
    }
    jest
      .spyOn(service, 'getAll')
      .mockImplementation(() => getAllResponse.data['prestadores'])
    await expect(constroller.getAll()).resolves.toStrictEqual(getAllResponse)
  })

  it('should return all prestadores by categoria', async () => {
    const getAllResponse = defaultResponse
    getAllResponse.data = {
      prestadores: [{ nome: 'Vinicius' }],
    }
    jest
      .spyOn(service, 'getPrestadorByCategoria')
      .mockImplementation(() => getAllResponse.data['prestadores'])
    await expect(constroller.getPrestadorByCategoria(1)).resolves.toStrictEqual(
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
    await expect(constroller.get(1)).resolves.toStrictEqual(getByIDResponse)
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
      constroller.create(
        {
          nome: 'Vinicius',
          usuario: { cpf: '133.568.145-56' },
        } as any,
        mockRequest.user,
      ),
    ).resolves.toStrictEqual(createResponse)
    expect(service.create).toBeCalledWith({
      nome: 'Vinicius',
      usuario: { cpf: '133.568.145-56', token: 'oi' },
    })
  })
})
