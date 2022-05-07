import knex from '../../knexfile'
import slugify from 'slugify'
import { roles } from '../../constants'

export default async (req, res) => {
  if (req.user.roleId !== roles.admin) {
    return res.status(403).send({
      message: 'Forbidden'
    })
  }
  
  const { title } = req.body
  const slug = slugify(title, { locale: 'vi' })

  if (!title) {
    return res.status(422).send({
      message: 'Title is required'
    })
  }

  const existedTopic = await knex('topics').where('title', title)
  
  if (existedTopic.length) {
    return res.status(409).send({
      message: 'Existed topic'
    })
  }
  
  await knex('topics').insert({ title: title, slug: slug })
  return res.status(200).send({
    message: 'Add new topic successfully.'
  })
}
