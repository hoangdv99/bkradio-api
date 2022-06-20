import knex from '../../../knexfile'
import { camelize } from '../../../utils'

export default async (req, res) => {
  const { id } = req.params
  const voice = await knex('voices').where({ id }).first()
  
  return res.status(200).send(camelize(voice)) 
}
