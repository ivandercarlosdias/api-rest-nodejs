import { knex as knexQueryBuilder } from 'knex'

export const knex = knexQueryBuilder({
   client: 'sqlite',
   connection: {
      filename: './tmp/app.db',
   },
})
