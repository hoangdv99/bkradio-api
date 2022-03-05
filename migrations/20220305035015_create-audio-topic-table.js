/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function up(knex) {
  return knex.schema.createTable('audio_topic', table => {
    table.increments('id').primary()
    table.integer('audio_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.integer('topic_id').unsigned().notNullable().references('id').inTable('topics').onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('audio_topic')
}
