import knex from '../../knexfile'

export default async (req, res) => {
  const audios = await knex('audios')
  
  return res.status(200).send(
    audios.map(audio => Object.assign({}, audio)) 
  )
}