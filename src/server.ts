import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'
import { env } from './env'

const app = fastify()

// GET, POST, PUT, PATCH & DELETE

app.get('/hello', async () => {
  const transaction = await knex('transactions').insert({
    id: randomUUID(),
    title: 'Transação de teste',
    amount: 1000,
  })

  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`)
  })
