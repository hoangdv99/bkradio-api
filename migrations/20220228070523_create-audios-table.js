/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('audios', table => {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.string('description')
    table.string('url').notNullable()
    table.string('author').notNullable()
    table.string('thumbnail_url')
    table.integer('posted_by').notNullable()
    table.integer('voice_id').notNullable()
    table.decimal('rating').defaultTo(0)
    table.integer('views').defaultTo(0)
    table.smallint('status').defaultTo(1)
  }) 
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('audios')
}
