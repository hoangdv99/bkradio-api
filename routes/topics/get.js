import knex from '../../knexfile'

export default async (req, res) => {
  const topics = await knex('topics')
  
  return res.status(200).send(
    topics.map(topic => Object.assign({}, topic)) 
  ) 
}
