import { Injectable } from '@nestjs/common'
import { Prestador } from '../models/prestadores/prestador.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PrestadoresService {
  constructor(
    @InjectRepository(Prestador) private readonly repo: Repository<Prestador>,
  ) {}

  public async getAll() {
    return this.repo.find()
  }

  public async create(prestador: Prestador) {
    return this.repo.save(prestador)
  }
}
