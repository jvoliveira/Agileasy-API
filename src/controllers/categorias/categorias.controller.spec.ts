import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'
import { TipoErro } from '../common/enums/tipo-erro.enum'
import { CategoriasController } from './categorias.controller'
import { CategoriasService } from './categorias.service'

describe('CategoriasController', () => {
  let controller: CategoriasController
  const service = createMock<CategoriasService>()

  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        {
          provide: CategoriasService,
          useValue: service,
        },
      ],
    }).compile()

    controller = module.get<CategoriasController>(CategoriasController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should by response categoria pai', async () => {
    const categorias = [{ descricao: 'Limpeza', catPai: null } as any]
    const shouldReturn = {
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      error: false,
      data: {
        categorias,
      },
    }
    service.getParents.mockResolvedValue(categorias)
    expect(controller.getCategoriaPai()).resolves.toStrictEqual(shouldReturn)
  })
})
