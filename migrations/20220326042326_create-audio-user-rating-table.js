/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('audio_user_ratings', table => {
    table.increments('id').primary()
    table.integer('audio_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.integer('rating')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('audio_user_ratings')
}
