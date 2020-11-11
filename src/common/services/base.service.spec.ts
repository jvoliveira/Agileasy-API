import { Test, TestingModule } from '@nestjs/testing'
import { createMock, DeepMocked } from '@golevelup/nestjs-testing'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PrestadoresService } from '../../controllers/prestadores/prestadores.service'
import { Prestador } from '../../models/prestadores/prestador.entity'
import { AllException } from '../exceptions/all.exception'
import { Provider } from '@nestjs/common'
import { BaseService } from './base.service'
import { Categoria } from '../../models/categorias/categoria.entity'
import { CategoriasService } from '../../controllers/categorias/categorias.service'
import { PedidosService } from '../../controllers/pedidos/pedidos.service'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { ServicosService } from '../../controllers/servicos/servicos.service'
import { Servico } from '../../models/servicos/servico.entity'
import { Cliente } from '../../models/clientes/cliente.entity'
import { ClientesService } from '../../controllers/clientes/clientes.service'

describe('Base Service Test', () => {
  const services: BaseService<any>[] = []
  const repos: DeepMocked<Repository<any>>[] = []
  beforeEach(async () => {
    const servicesTemp = [
      PrestadoresService,
      CategoriasService,
      PedidosService,
      ServicosService,
      ClientesService,
    ] // Aqui coloca todos os services que utilizam o base.service

    const models = [Prestador, Categoria, Pedido, Servico, Cliente] // Aqui coloca todos os models que utilizam o base.service nos seus services
    const providers: Provider<any>[] = []
    services.length = 0
    repos.length = 0
    for (const model of models) {
      const repo = createMock<Repository<typeof model>>()
      providers.push({
        provide: getRepositoryToken(model),
        useValue: repo,
      })
      repos.push(repo)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [...servicesTemp, ...providers],
    }).compile()

    for (const service of servicesTemp) {
      services.push(module.get(service as any))
    }
  })

  it('should be get all', async () => {
    const shouldReturn = [
      {
        nome: 'Vinicius Picanco',
      },
    ]
    for (let i = 0; i < services.length; i++) {
      const repo = repos[i]
      const service = services[i]

      expect(service).toBeDefined()

      repo.find.mockReturnValue(shouldReturn as any)

      expect(await service.getAll()).toBe(shouldReturn)
      expect(repo.find).toHaveBeenCalledWith({ where: { ativo: true } })

      repo.find.mockClear()
      repo.find.mockReturnValue(null)

      await expect(service.getAll()).rejects.toThrow(AllException)
    }
  })

  it('should be get by id', async () => {
    const shouldReturn = {
      nome: 'Vinicius Picanco',
    }
    for (let i = 0; i < services.length; i++) {
      const repo = repos[i]
      const service = services[i]

      expect(service).toBeDefined()

      repo.findOne.mockReturnValue(shouldReturn as any)

      expect(await service.getByID(1)).toBe(shouldReturn)

      expect(repo.findOne).toHaveBeenCalledTimes(1)
      expect(repo.findOne).toHaveBeenCalledWith(1, { where: { ativo: true } })

      repo.findOne.mockClear()
      repo.findOne.mockReturnValue(null)

      await expect(service.getByID(1)).rejects.toThrow(AllException)
    }
  })

  it('should be create', async () => {
    const shouldReturn = {
      id: 1,
      nome: 'Vinicius Picanco',
    }
    const createParam = {
      nome: 'Vinicius Picanco',
    }
    for (let i = 0; i < services.length; i++) {
      const repo = repos[i]
      const service = services[i]

      expect(service).toBeDefined()

      repo.save.mockReturnValue(shouldReturn as any)

      expect(await service.create(createParam)).toBe(shouldReturn)

      expect(repo.save).toHaveBeenCalledTimes(1)
      expect(repo.save).toHaveBeenCalledWith(createParam)

      repo.save.mockClear()
      repo.save.mockReturnValue(null)

      await expect(service.create(createParam)).rejects.toThrow(AllException)
    }
  })

  it('should be update', async () => {
    const shouldReturn = {
      id: 1,
      nome: 'Vinicius Picanco',
    }
    const updateParam = {
      nome: 'Vinicius Picanco',
    }
    for (let i = 0; i < services.length; i++) {
      const repo = repos[i]
      const service = services[i]

      expect(service).toBeDefined()

      repo.update.mockResolvedValue({ affected: 1 } as any)
      repo.findOneOrFail.mockResolvedValue(shouldReturn as any)

      expect(await service.update(1, updateParam as any)).toBe(shouldReturn)

      expect(repo.update).toHaveBeenCalledTimes(1)
      expect(repo.update).toHaveBeenCalledWith(1, updateParam)

      repo.update.mockClear()
      repo.update.mockResolvedValue({ affected: 0 } as any)

      await expect(service.update(1, updateParam as any)).rejects.toThrow(
        AllException,
      )
    }
  })

  it('should be delete', async () => {
    const shouldReturn = {
      id: 1,
      nome: 'Vinicius Picanco',
    }

    const shouldReturnSave = {
      id: 1,
      nome: 'Vinicius Picanco',
      ativo: false,
    }
    const updateParam = {
      id: 1,
      nome: 'Vinicius Picanco',
      ativo: false,
    }
    for (let i = 0; i < services.length; i++) {
      const repo = repos[i]
      const service = services[i]

      expect(service).toBeDefined()

      repo.findOne.mockReturnValue(shouldReturn as any)
      repo.save.mockReturnValue(shouldReturnSave as any)

      expect(await service.delete(1)).toBe(shouldReturnSave)

      expect(repo.save).toHaveBeenCalledTimes(1)
      expect(repo.save).toHaveBeenCalledWith(updateParam)

      repo.findOne.mockClear()
      repo.findOne.mockReturnValue(null)
      repo.save.mockClear()
      repo.save.mockReturnValue(null)

      await expect(service.delete(1)).rejects.toThrow(AllException)
    }
  })
})
