import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import knex from "../../../knexfile"
import { camelize } from '../../../utils'

export default async (req, res) => {
  const { username, password } = req.body

  const user = await knex('users').where({ username })
  
  if (!user.length) {
    return res.status(401).send({
      message: 'Thông tin tài khoản và mật khẩu không chính xác.'
    })
  }

  const check = await bcrypt.compare(password, user[0].password)
  if (!check) {
    return res.status(401).send({
      message: 'Thông tin tài khoản và mật khẩu không chính xác.'
    })
  }

  const { roleId, id } = camelize(user[0])

  const token = jwt.sign({ username, roleId, id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '365d'
  })

  return res.status(200).json({ token })
}