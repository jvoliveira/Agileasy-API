import { registerAs } from '@nestjs/config'
export default registerAs('cielo', () => ({
  merchantId: process.env.MERCHANT_ID,
  merchantKey: process.env.MERCHANT_KEY,
  sandbox: process.env.SANDBOX,
  debug: process.env.DEBUG,
}))
