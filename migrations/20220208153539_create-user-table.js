/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.smallint('role_id').notNullable()
    table.string('username').notNullable()
    table.string('password').notNullable()
    table.string('avatar')
    table.string('email')
    table.string('status').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("users");
}
