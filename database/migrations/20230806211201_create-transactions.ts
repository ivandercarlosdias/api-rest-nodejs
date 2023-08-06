import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable('transactions', (table) => {
      table.uuid('id').primary
      table.text('title').notNullable
   })
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable('transactions')
}
