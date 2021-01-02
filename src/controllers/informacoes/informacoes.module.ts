import { Module } from '@nestjs/common'
import { UserService } from '../../common/services/user.service'
import { InformacaoEntityModule } from '../../models/informacao/informacao.module'
import { UsuariosEntityModule } from '../../models/usuarios/usuarios.module'
import { InformacoesController } from './informacoes.controller'
import { InformacoesService } from './informacoes.service'

@Module({
  imports: [InformacaoEntityModule, UsuariosEntityModule],
  controllers: [InformacoesController],
  providers: [InformacoesService, UserService],
})
export class InformacoesModule {}
