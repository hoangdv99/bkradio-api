
import pkg from 'jsonwebtoken'
const { verify } = pkg

export const authMiddleware = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || ''
  if (!token) next()
  else {
    token = token.replace('Bearer ', '')
    const decodedToken = verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken

    next()
  }
}
