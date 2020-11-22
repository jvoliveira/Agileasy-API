import { Test, TestingModule } from '@nestjs/testing'
import { DisponibilidadesController } from './disponibilidades.controller'
import * as moment from 'moment-timezone'
import { DiaSemana } from '../../models/disponibilidades/disponibilidade.interface'
import { DisponibilidadesService } from './disponibilidades.service'
import { createMock } from '@golevelup/nestjs-testing'
import { UserService } from '../../common/services/user.service'
import * as admin from 'firebase-admin'
import { TipoErro } from '../../common/enums/tipo-erro.enum'

describe('DisponibilidadesController', () => {
  let controller: DisponibilidadesController
  const service = createMock<DisponibilidadesService>()
  const userService = createMock<UserService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadesController],
      providers: [
        {
          provide: DisponibilidadesService,
          useValue: service,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile()

    controller = module.get<DisponibilidadesController>(
      DisponibilidadesController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should add disponibilidade prestador', async () => {
    const createResponse = {
      error: false,
      error_id: TipoErro.SEM_ERROS,
      message: 'Sucesso!',
      data: {
        disponibilidades: {
          excepcional: false,
          diaSemana: DiaSemana.DOMINGO,
          inicio: '2020-08-14T19:12:13.000Z',
          fim: '2020-08-14T19:12:13.000Z',
        },
      },
    }
    const mockUser = createMock<admin.auth.UserRecord>()
    mockUser.uid = 'teste'
    userService.getPrestadorByToken.mockResolvedValue({ id: 1 } as any)
    service.updateAllDisponibilidade.mockResolvedValue(
      createResponse.data.disponibilidades as any,
    )
    await expect(
      controller.addDisponibilidades(
        {
          disponibilidades: [
            {
              diaSemana: DiaSemana.DOMINGO,
              excepcional: false,
              fim: moment('2020-08-14T19:12:13-03:00').toDate(),
              inicio: moment('2020-08-14T19:12:13-03:00').toDate(),
            },
          ],
        },
        mockUser,
      ),
    ).resolves.toStrictEqual(createResponse)
    expect(service.updateAllDisponibilidade).toBeCalledWith(1, [
      {
        ativo: undefined,
        id: undefined,
        prestador: {
          id: 1,
        },
        excepcional: false,
        diaSemana: DiaSemana.DOMINGO,
        inicio: moment('2020-08-14T19:12:13-03:00').toDate(),
        fim: moment('2020-08-14T19:12:13-03:00').toDate(),
      },
    ])
  })
})
