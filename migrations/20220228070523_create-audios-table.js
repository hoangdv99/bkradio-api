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
    table.integer('posted_by').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.integer('voice_id').unsigned().notNullable().references('id').inTable('voices').onDelete('CASCADE')
    table.decimal('rating').defaultTo(0)
    table.integer('views').defaultTo(0)
    table.smallint('status').defaultTo(1)
    table.string('slug', 255)
    table.integer('rating_count').defaultTo(0)
    table.smallint('type').defaultTo(1).comment('1: Truyen ngan, 2: Truyen dai, 3: Sach noi, 4: Podcast')
    table.timestamps(true, true)
  }) 
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('audios')
}
