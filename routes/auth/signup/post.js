import bcrypt from 'bcryptjs'
import knex from "../../../knexfile"

export default async (req, res) => {
  const { username, password } = req.body
  const existedUser = await knex.select('*').from('users').where('username', username)
  if (existedUser.length) {
    return res.status(409).send({
      message: 'Username already exists'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await knex('users').insert({
    username,
    password: hashedPassword,
    role_id: 1,
    status: 1
  })

  return res.status(201).send({
    message: 'User created successfully',
    user
  })
}
