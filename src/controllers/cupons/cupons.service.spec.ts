import { Test, TestingModule } from '@nestjs/testing'
import { CuponsService } from './cupons.service'
import { createMock } from '@golevelup/nestjs-testing'
import { Repository } from 'typeorm'
import { Cupom } from '../../models/cupons/cupom.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('CuponsService', () => {
  let service: CuponsService
  const mockRepository = createMock<Repository<Cupom>>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuponsService,
        {
          provide: getRepositoryToken(Cupom),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<CuponsService>(CuponsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should validateCupom normal', async () => {
    const shouldReturn = {
      id: 1,
      ativo: true,
      indicacao: false,
      codigo: '#ITAPERUNA',
      desconto: 10,
      valorMinimo: 2,
      tipoCupom: 0,
      tipoDesconto: 1,
      voucher: 0,
      validade: '2100-12-29T05:00:00.000Z',
      quantidadeMaxima: 1,
      restantes: 1,
    }

    mockRepository.find.mockResolvedValue([shouldReturn] as any)
    await expect(
      service.validateCupomNormal('#ITAPERUNA'),
    ).resolves.toStrictEqual(shouldReturn)
  })
})
