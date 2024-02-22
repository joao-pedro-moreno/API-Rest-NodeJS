import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// Request body:  HTTPs => Criar ou editar algum recurso

// Cookies -> Formas de manter contexto entre requisições

// TESTES
// - Unitários: unidade da sua aplicação
// - Integração: comunicação entre duas ou mais unidades
// - E2E -> ponta a ponta: simulam um usuário operando a aplicação (Chamadas HTTP, WebSockets)

// Pirâmide de testes: E2E (não dependem de nenhuma tecnologia, não dependem de arquitetura)

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = req.cookies

    const { id } = getTransactionParamsSchema.parse(req.params)

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return { transaction }
  })

  app.get('/sumary', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies

    const sumary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
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

    let sessionId = req.cookies.session_id

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send()
  })
}
