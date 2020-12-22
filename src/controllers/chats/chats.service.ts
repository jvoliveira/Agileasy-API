import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin'
import { Injectable } from '@nestjs/common'
import { TipoErro } from '../../common/enums/tipo-erro.enum'
import { AllException } from '../../common/exceptions/all.exception'
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
        texto: chatConfigsData.mensagemPadrao,
        autor: 2,
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

  public async canSendNotification(
    fidChat: string,
    who: 'prestador' | 'cliente',
  ): Promise<void> {
    if (!fidChat) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'O chat não foi iniciado para essa conversa',
      )
    }
    const chatRef = await this.firebaseService
      .collection('chats')
      .doc(fidChat)
      .get()
    if (!chatRef.exists) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'Para enviar notificação precisa ter um chat iniciado',
      )
    }

    const chatDados = chatRef.data()
    if (
      who === 'cliente' &&
      chatDados.ultimaNotificacaoCliente &&
      moment()
        .utc()
        .isBefore(
          moment(chatDados.ultimaNotificacaoCliente)
            .utc()
            .add(30, 'seconds'),
        )
    ) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'Você não pode notificar o cliente agora',
      )
    }

    if (
      who === 'prestador' &&
      chatDados.ultimaNotificacaoPrestador &&
      moment()
        .utc()
        .isBefore(
          moment(chatDados.ultimaNotificacaoPrestador)
            .utc()
            .add(30, 'seconds'),
        )
    ) {
      throw new AllException(
        TipoErro.DADOS_INVALIDOS,
        'Você não pode notificar o profissional agora',
      )
    }

    if (who === 'cliente') {
      await chatRef.ref.update({
        ultimaNotificacaoCliente: moment()
          .utc()
          .format(),
      })
    } else {
      await chatRef.ref.update({
        ultimaNotificacaoPrestador: moment()
          .utc()
          .format(),
      })
    }
  }
}
