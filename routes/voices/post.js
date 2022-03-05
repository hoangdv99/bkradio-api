import knex from '../../knexfile'
import slugify from 'slugify'

export default async (req, res) => {
  const { name, gender } = req.body

  if (!name || !gender) {
    return res.status(422).send({
      message: 'Name and gender are required'
    })
  }

  const slug = slugify(name, { locale: 'vi' })

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
