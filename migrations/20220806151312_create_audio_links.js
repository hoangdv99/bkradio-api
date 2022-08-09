/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function up(knex) {
  return knex.schema.createTable('audio_links', table => {
    table.increments('id').primary()
    table.integer('audio_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.integer('voice_id').unsigned().notNullable().references('id').inTable('voices').onDelete('CASCADE')
    table.text('link').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('audio_links')
}
