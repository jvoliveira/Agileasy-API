import { HttpModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../../common/services/user.service'
import { CieloConfigModule } from '../../config/cielo/config.module'
import { CieloConfigService } from '../../config/cielo/config.service'
import { MetodosPagamentoEntityModule } from '../../models/metodos-pagamento/metodos-pagamento.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { MetodosPagamentoController } from './metodos-pagamento.controller'
import { MetodosPagamentoService } from './metodos-pagamento.service'

@Module({
  imports: [
    MetodosPagamentoEntityModule,
    UsuariosEntityModule,
    CieloConfigModule,
    HttpModule,
  ],
  controllers: [MetodosPagamentoController],
  providers: [MetodosPagamentoService, UserService, CieloConfigService],
})
export class MetodosPagamentoModule {}
