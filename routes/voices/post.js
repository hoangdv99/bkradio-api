import knex from '../../knexfile'
import slugify from 'slugify'
import { roles } from '../../constants'

export default async (req, res) => {
  if (req.user.roleId !== roles.admin) {
    return res.status(403).send({
      message: 'Forbidden'
    })
  }
  const { name, gender } = req.body

  if (!name || !gender) {
    return res.status(422).send({
      message: 'Name and gender are required'
    })
  }

  const slug = slugify(name, { lower: true, locale: 'vi' })

  const existedName = await knex('voices').where('name', name)
  
  if (existedName.length) {
    return res.status(409).send({
      message: 'Existed voice'
    })
  }
  
  await knex('voices').insert({ name: name, slug: slug, gender: gender })
  return res.status(200).send({
    message: 'Add new voice successfully.'
  })
}
