export const DEFAULT_NOTIFICATION = {
  notification: {
    title: '',
    body: 'Abra o aplicativo para conferir.',
  },
  data: {
    click_action: 'FLUTTER_NOTIFICATION_CLICK',
    sound: 'default',
  },
  apns: {
    payload: {
      aps: {
        sound: 'default',
      },
    },
  },
  token: '',
}
