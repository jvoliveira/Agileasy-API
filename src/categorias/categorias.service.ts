import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../common/services/base.service'
import { Categoria } from '../models/categorias/categoria.entity'

@Injectable()
export class CategoriasService extends BaseService<Categoria> {
  constructor(@InjectRepository(Categoria) repo: Repository<Categoria>) {
    super(repo)
  }
}
