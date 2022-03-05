/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('voices', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('slug').notNullable()
    table.smallint('gender').notNullable().comment('Male: 1, Female: 2')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('voices')
}
