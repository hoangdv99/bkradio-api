
import { verify } from 'jsonwebtoken'

export const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error)
      }
      return resolve(decoded.data)
    })
  })
}
