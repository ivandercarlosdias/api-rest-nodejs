import crypto from 'node:crypto'
import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
   const transaction = await knex('transactions')
      .insert({
         id: crypto.randomUUID(),
         title: 'Transição de teste',
         amount: 1500,
      })
      .returning('*')

   return transaction

   // return await knex('transactions').select('*')
})

app.listen({ port: env.PORT }).then(() => {
   console.log('HTTP Server is running!')
})
