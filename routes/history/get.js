import knex from "../../knexfile"
import { camelize } from '../../utils'

export default async (req, res) => {
  const userId = req.query.userId

  if (!userId) return res.sendStatus(403)

  const audios = await knex.select(
    'h.current_listening_time',
    'a.id',
    'a.title',
    'a.slug',
    'a.author'
  )
    .from('histories as h')
    .leftJoin('audios as a', 'h.audio_id', 'a.id')
    .where('h.user_id', '=', userId)
    .orderBy('h.updated_at', 'desc')
    .limit(5)

  return res.status(200).send(
    Object.values(audios).map(audio => camelize(audio))
  )
}
