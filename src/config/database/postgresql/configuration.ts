import { registerAs } from '@nestjs/config'
export default registerAs('pg-models', () => ({
  databaseName: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
}))
