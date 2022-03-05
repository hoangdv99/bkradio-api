import knex from '../../knexfile'

export default async (req, res) => {
  const voices = await knex('voices')
  
  return res.status(200).send(
    voices.map(voice => Object.assign({}, voice)) 
  ) 
}
