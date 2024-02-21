import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
// Request body:  HTTPs => Criar ou editar algum recurso

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })

  app.get('/:id', async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  app.get('/sumary', async () => {
    const sumary = await knex('transactions')
      .sum('amount', {
        as: 'amount',
      })
      .first()

    return { sumary }
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return res.status(201).send()
  })
}
