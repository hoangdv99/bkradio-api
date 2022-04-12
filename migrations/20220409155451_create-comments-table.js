/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('comments', table => {
    table.increments('id').primary()
    table.integer('audio_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.integer('user_id').unsigned().notNullable().references('id').inTable('audios').onDelete('CASCADE')
    table.string('content')
    table.tinyint('is_reply').defaultTo(0)
    table.integer('parent_comment_id').defaultTo(null)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('comments')
}
