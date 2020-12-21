import { Module } from '@nestjs/common'
import { UserService } from '../../common/services/user.service'
import { AvaliacaoEntityModule } from '../../models/avaliacao/avaliacao.module'
import { PedidosEntityModule } from '../../models/pedidos/pedidos.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { PedidosService } from '../pedidos/pedidos.service'
import { AvaliacoesController } from './avaliacoes.controller'
import { AvaliacoesService } from './avaliacoes.service'

@Module({
  imports: [AvaliacaoEntityModule, PedidosEntityModule, UsuariosEntityModule],
  controllers: [AvaliacoesController],
  providers: [AvaliacoesService, UserService, PedidosService],
})
export class AvaliacoesModule {}
