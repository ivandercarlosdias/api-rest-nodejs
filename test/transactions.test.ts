import { test, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
   beforeAll(async () => {
      await app.ready()
   })

   afterAll(async () => {
      await app.close()
   })

   beforeEach(() => {
      execSync('npm run knex migrate:rollback --all')
      execSync('npm run knex migrate:latest')
   })

   test('should be able to create a new transaction', async () => {
      await request(app.server)
         .post('/transactions')
         .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
         })
         .expect(201)
   })

   test('should be able to list all transactions', async () => {
      const createTransactionResponse = await request(app.server)
         .post('/transactions')
         .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
         })
         .expect(201)

      const cookies = createTransactionResponse.get('Set-Cookie')

      const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

      expect(listTransactionsResponse.body.transactions).toEqual([
         expect.objectContaining({
            title: 'New transaction',
            amount: 5000,
         }),
      ])
   })

   test('should be able to get a specific transaction', async () => {
      const createTransactionResponse = await request(app.server)
         .post('/transactions')
         .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
         })
         .expect(201)

      const cookies = createTransactionResponse.get('Set-Cookie')

      const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

      const transactionId = listTransactionsResponse.body.transactions[0].id

      const getTransactionsResponse = await request(app.server)
         .get(`/transactions/${transactionId}`)
         .set('Cookie', cookies)
         .expect(200)

      expect(getTransactionsResponse.body.transaction).toEqual(
         expect.objectContaining({
            title: 'New transaction',
            amount: 5000,
         })
      )
   })

   test.todo('should be able to get the summary')
})
