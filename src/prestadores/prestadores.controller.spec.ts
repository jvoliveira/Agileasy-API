import { Test, TestingModule } from '@nestjs/testing'
import { PrestadoresController } from './prestadores.controller'

describe('PrestadoresController', () => {
  let controller: PrestadoresController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestadoresController],
    }).compile()

    controller = module.get<PrestadoresController>(PrestadoresController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
