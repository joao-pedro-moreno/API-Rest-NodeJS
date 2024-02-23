import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// GET, POST, PUT, PATCH & DELETE

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
