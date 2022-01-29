import knex from 'knex'
const connection = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_NAME,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  socketPath: process.env.MYSQL_SOCKET_PATH,
  charset: 'utf8',
  typeCast: function (field, next) {
    if (field.type === 'JSON') {
      return (JSON.parse(field.string()))
    }
    return next()
  }
}

export default knex({
  client: 'mysql',
  connection
})
