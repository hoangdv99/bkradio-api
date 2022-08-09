/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function up(knex) {
  return knex.schema.table('histories', table => {
    table.integer('audio_link_id').unsigned().notNullable().defaultTo(0).references('id').inTable('audio_links').onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  knex.schema.table('histories', function(table) {
    table.dropColumn('audio_link_id')
  })
}
