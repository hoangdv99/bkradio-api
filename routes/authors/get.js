import knex from '../../knexfile'

export default async (req, res) => {
  const authors = await knex('authors')
  
  return res.status(200).send(
    authors.map(author => Object.assign({}, author)) 
  ) 
}
