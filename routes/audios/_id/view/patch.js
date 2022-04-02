import knex from "../../../../knexfile"

export default async (req, res) => {
  const { audioId, userId } = req.body
  await knex('audios').increment('views').where({ id: audioId })

  return res.sendStatus(200)
}
