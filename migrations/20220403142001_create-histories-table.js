/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('histories', table => {
    table.increments('id').primary()
    table.integer('audio_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.integer('user_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.integer('current_listening_time').defaultTo(0)
    table.tinyint('listened_percent').defaultTo(0)
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('histories')
}
