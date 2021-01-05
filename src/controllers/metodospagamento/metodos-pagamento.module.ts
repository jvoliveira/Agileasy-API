import { Module } from '@nestjs/common'
import { UserService } from '../../common/services/user.service'
import { CieloConfigService } from '../../config/cielo/config.service'
import { MetodosPagamentoEntityModule } from '../../models/metodos-pagamento/metodos-pagamento.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { MetodosPagamentoController } from './metodos-pagamento.controller'
import { MetodosPagamentoService } from './metodos-pagamento.service'

@Module({
  imports: [MetodosPagamentoEntityModule, UsuariosEntityModule],
  controllers: [MetodosPagamentoController],
  providers: [MetodosPagamentoService, UserService, CieloConfigService],
})
export class MetodosPagamentoModule {}
