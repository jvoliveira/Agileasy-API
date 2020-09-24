import { registerAs } from '@nestjs/config'
export default registerAs('app', () => ({
  host: process.env.HOST,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
}))
