/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function up(knex) {
  return knex.schema.createTable('topics', table => {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.string('slug').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('topics')
}
