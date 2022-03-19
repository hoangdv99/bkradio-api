import pkg from 'jsonwebtoken'
const { verify } = pkg;

export const authMiddleware = (req, res, next) => {
  const userToken = req.headers['x-access-token']
  if (!userToken) {
    return res.status(401).send('No token provided')
  }
  let decodedToken
  try {
    decodedToken = verify(userToken, process.env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken
  } catch (err) {
    err.statusCode = 500
    throw err
  }
  if (!decodedToken) {
    return res.status(401).send('No token provided')
  }
  next()
}
