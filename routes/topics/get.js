import knex from '../../knexfile'
import { camelize } from '../../utils'

export default async (req, res) => {
  const topics = await knex('topics')
  
  return res.status(200).send(
    Object.values(topics).map(topic => camelize(topic)),
  ) 
}
