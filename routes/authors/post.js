import knex from '../../knexfile'
import slugify from 'slugify'

export default async (req, res) => {
  const { name } = req.body
  const slug = slugify(name, { locale: 'vi' })

  if (!name) {
    return res.status(422).send({
      message: 'Name is required'
    })
  }

  const existedName = await knex('authors').where('name', name)
  
  if (existedName.length) {
    return res.status(409).send({
      message: 'Existed author'
    })
  }
  
  await knex('authors').insert({ name: name, slug: slug })
  return res.status(200).send({
    message: 'Add new author successfully.'
  })
}
