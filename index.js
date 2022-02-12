import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import statuses from 'statuses'
import promiseRouter from 'express-promise-router'
const nnnRouter = (await import('nnn-router')).default

express.response.sendStatus = function(statusCode) {
  const body = { message: statuses[statusCode] || String(statusCode) }
  this.statusCode = statusCode
  this.type('json')
  this.send(body)
}

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true
  })
)

app.use(
  express.json(),
  express.urlencoded({ extended: true })
)

app.use(
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({
        message: error.message
      })
    }

    return next()
  }
)

app.use(
  nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.log(error)

    return res.sendStatus(500)
  }
)

const port = process.env.PORT || 5000
const host = process.env.HOST || 'localhost'
app.listen(port, () => {
  console.log(`Listening: http://${host}:${port}`)
})
