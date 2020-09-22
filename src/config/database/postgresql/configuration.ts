import { registerAs } from '@nestjs/config'
export default registerAs('pg-models', () => ({
  name: process.env.NAME_BD,
  host: process.env.HOST_BD,
  port: process.env.PORT_BD,
  password: process.env.PASSWORD_BD,
}))
