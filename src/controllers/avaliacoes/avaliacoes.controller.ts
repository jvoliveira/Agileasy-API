import { Controller } from '@nestjs/common'
import { AvaliacoesService } from './avaliacoes.service'

@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private service: AvaliacoesService) {}
}
