/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function up(knex) {
  return knex.schema.table('voices', table => {
    table.tinyint('region').defaultTo(null)
    table.tinyint('is_tts_voice').defaultTo(0)
    table.string('tts_value').defaultTo(null)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  knex.schema.table('voices', function(table) {
    table.dropColumn('region')
    table.dropColumn('is_tts_voice')
    table.dropColumn('tts_value')
  })
}
