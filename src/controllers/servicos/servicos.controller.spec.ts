import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../common/services/user.service'
import { ServicosController } from './servicos.controller'
import { ServicosService } from './servicos.service'
import { createMock } from '@golevelup/nestjs-testing'
import * as admin from 'firebase-admin'

describe('ServicosController', () => {
  let controller: ServicosController
  const repo = createMock<ServicosService>()
  const userService = createMock<UserService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [
        {
          provide: ServicosService,
          useValue: repo,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile()

    controller = module.get<ServicosController>(ServicosController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return all servicos from prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servicos: [
          {
            id: 1,
            ativo: true,
            descricao: 'Serviço completo de pé e mão',
            valor: 25,
            nome: 'Pé e mão',
            urlFoto:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/download.jpeg',
            valorFrete: 5,
            tempoMedio: 90,
            noEstabelecimento: false,
            delivery: true,
          },
          {
            id: 2,
            ativo: true,
            descricao: 'Corte popular de cabelo',
            valor: 30,
            nome: 'Corte de cabelo',
            urlFoto:
              'https://firebasestorage.googleapis.com/v0/b/delivery-servicos.appspot.com/o/Dyed-Udon-with-Shaved-Hairline-702x1024.jpg',
            valorFrete: 0,
            tempoMedio: 60,
            noEstabelecimento: true,
            delivery: false,
          },
          {
            id: 9,
            ativo: true,
            descricao: 'Esse serviço é novo',
            valor: 256.6,
            nome: 'Novo serviço',
            urlFoto: 'www.fotourl.com.br',
            valorFrete: 10,
            tempoMedio: 50,
            noEstabelecimento: false,
            delivery: true,
          },
        ],
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    repo.getServicoByPrestador.mockResolvedValue(
      shouldReturn.data.servicos as any,
    )
    await expect(
      controller.getServicosByPrestador(mockUser),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should adicionar servicos from prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servico: {
          descricao: 'Esse serviço é novo',
          valor: 256.6,
          nome: 'Novo serviço',
          urlFoto: 'www.fotourl.com.br',
          valorFrete: 10,
          tempoMedio: 50,
          noEstabelecimento: false,
          delivery: true,
          prestador: {
            id: 1,
          },
          id: 9,
          ativo: true,
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    repo.create.mockResolvedValue(shouldReturn.data.servico as any)
    await expect(
      controller.addServico(mockUser, shouldReturn.data.servico as any),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should alterar servico from prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {
        servico: {
          id: 1,
          ativo: false,
          descricao: 'Esse serviço é novo',
          valor: 256.6,
          nome: 'Novo serviço',
          urlFoto: 'www.fotourl.com.br',
          valorFrete: 10,
          tempoMedio: 50,
          noEstabelecimento: false,
          delivery: true,
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    repo.getByIdWithPrestador.mockResolvedValue({
      id: 1,
      prestador: { id: 1 },
    } as any)
    repo.create.mockResolvedValue(shouldReturn.data.servico as any)
    repo.delete.mockResolvedValue(shouldReturn.data.servico as any)
    await expect(
      controller.updateServico(mockUser, 1, shouldReturn.data.servico as any),
    ).resolves.toStrictEqual(shouldReturn)
  })

  it('should delete servico from prestador', async () => {
    const shouldReturn = {
      error_id: -1,
      message: 'Sucesso!',
      error: false,
      data: {},
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    repo.getByIdWithPrestador.mockResolvedValue({
      id: 1,
      prestador: { id: 1 },
    } as any)
    repo.delete.mockResolvedValue(shouldReturn.data as any)
    await expect(controller.removeServico(mockUser, 1)).resolves.toStrictEqual(
      shouldReturn,
    )
  })
})
