import * as nodemailer from 'nodemailer'
import { Pedido } from '../../../models/pedidos/pedido.entity'
import { Servico } from '../../../models/servicos/servico.entity'
import { ModelComprovante } from './model_Comprovante'

export async function sendEmail(
  emailDestinatario: string,
  assunto: string,
  pedido: Pedido,
  servico: any,
) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.agileasyapp.com.br',
    port: 587,
    secure: false,
    auth: {
      user: 'contato@agileasyapp.com.br',
      pass: 'Severino@4565',
    },
    tls: { rejectUnauthorized: false },
  })
  const model = new ModelComprovante(pedido, servico)
  const mailOptions = {
    from: 'Equipe Agileasy <contato@agileasyapp.com.br>',
    to: emailDestinatario,
    subject: assunto,
    html: model.code,
  }

  const info = transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email enviado: ' + info.response)
    }
  })
}
