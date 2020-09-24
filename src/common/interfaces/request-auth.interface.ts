import * as admin from 'firebase-admin'
export interface RequestAuth extends Request {
  user: admin.auth.UserRecord
}
