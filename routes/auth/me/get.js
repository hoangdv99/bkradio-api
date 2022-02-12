import jwt from 'jsonwebtoken'

export default (req, res) => {
  const authHeader = req.get("Authorization")
  const token = authHeader.split(" ")[1]
  let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  return res.status(200).json({
    user: {
      username: decodedToken.username
    }
  })
}
