// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import dotenv from 'dotenv'
import knex from 'knex'
dotenv.config()

export default knex({
  client: 'mysql',
  connection: {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    typeCast: function (field, next) {
      if (field.type === 'JSON') {
        return (JSON.parse(field.string()))
      }
      return next()
    }
  }
})
