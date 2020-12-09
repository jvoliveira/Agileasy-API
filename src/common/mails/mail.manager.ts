import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { Pedido } from '../../models/pedidos/pedido.entity'
import { ModelComprovante } from './models/comprovante.model'

@Injectable()
export class MailManager {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(
    emailDestinatario: string,
    assunto: string,
    pedido: Pedido,
    servico: any,
  ) {
    const model = new ModelComprovante(pedido, servico)
    const mailOptions = {
      to: emailDestinatario,
      subject: assunto,
      html: model.code,
    }

    this.mailerService.sendMail(mailOptions)
  }
}
