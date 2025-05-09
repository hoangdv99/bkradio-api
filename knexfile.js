// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import dotenv from 'dotenv'
import knex from 'knex'
import { attachPaginate } from 'knex-paginate'
dotenv.config()
attachPaginate()

export default knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
    typeCast: function (field, next) {
      if (field.type === 'JSON') {
        return (JSON.parse(field.string()))
      }
      return next()
    }
  }
})

// Use when run migrate

// const config = {
//   client: 'mysql',
//   connection: {
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_NAME,
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     charset: 'utf8mb4',
//     typeCast: function (field, next) {
//       if (field.type === 'JSON') {
//         return (JSON.parse(field.string()))
//       }
//       return next()
//     }
//   }
// }

// export default config
