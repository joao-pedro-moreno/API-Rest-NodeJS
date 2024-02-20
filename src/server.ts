import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'

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
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server Running on port 3333')
  })
