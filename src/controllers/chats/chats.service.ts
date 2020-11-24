import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin'
import { Injectable } from '@nestjs/common'
import * as moment from 'moment-timezone'

@Injectable()
export class ChatsService {
  constructor(private firebaseService: FirebaseFirestoreService) {}

  public async createChat(
    idPedido: number,
    idPrestador: number,
    idCliente: number,
    whoBegin: 'prestador' | 'cliente',
  ): Promise<string> {
    const batch = this.firebaseService.batch()
    const chatConfigs = await this.firebaseService
      .collection('configuracoes')
      .doc('chats')
      .get()
    const chatRef = this.firebaseService.collection('chats').doc()
    const mensagemRef = this.firebaseService
      .collection('mensagens')
      .doc(chatRef.id)
      .collection('mensagens')
      .doc()

    batch.create(chatRef, {
      idPrestador,
      idCliente,
      quemInicio: whoBegin,
      idPedido,
    })

    const chatConfigsData = chatConfigs.data()

    if (chatConfigsData) {
      batch.create(mensagemRef, {
        mensagem: chatConfigsData.mensagemPadrao,
        autorMensagem: 2,
        dataHora: moment()
          .utc()
          .format(),
        lida: false,
        entregue: false,
      })
    }

    await batch.commit()

    return chatRef.id
  }
}
