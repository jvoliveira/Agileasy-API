import * as nodemailer from 'nodemailer'
import { ModelHtml, TipoEmail } from './modelHtml'

export async function main(
  emailDestinatario: string,
  assunto: string,
  tipoEmail: TipoEmail,
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
  const model = new ModelHtml(tipoEmail)
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

  console.log('infooo: ' + info)
}
