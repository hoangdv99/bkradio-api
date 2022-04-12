/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('entity_likes', table => {
    table.increments('id').primary()
    table.integer('comment_id').unsigned().notNullable().references('id').inTable('comments').onDelete('CASCADE')
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.tinyint('is_dislike').defaultTo(0)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('entity_likes')
}
