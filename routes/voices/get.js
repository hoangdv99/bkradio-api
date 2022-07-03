import knex from '../../knexfile'
import { camelize } from '../../utils'

export default async (req, res) => {
  const voices = await knex('voices')
  
  return res.status(200).send(
    Object.values(voices).map(voice => camelize(voice)),
  ) 
}
