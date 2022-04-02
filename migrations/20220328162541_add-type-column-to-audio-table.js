/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('audios', table => {
    table.integer('type').defaultTo(1).comment('1: Truyen ngan, 2: Truyen dai, 3: Sach noi, 4: Podcast')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('audios', table => {
    table.dropColumn('type')
  })
}
