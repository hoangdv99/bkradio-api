import knex from "../../../knexfile"
import { camelize } from '../../../utils'
import { audioStatus } from '../../../constants'

export default async (req, res) => {
  const period = req.query.period
  const audios = await knex.select(
    'a.id',
    'a.title',
    'a.author',
    'a.thumbnail_url',
    'a.slug',
  )
    .count('a.id', { as: 'listen_time_count' })
    .from('audios as a')
    .where({ status: audioStatus.public })
    .join('histories as h', 'a.id', '=', 'h.audio_id')
    .where('h.listened_percent', '>=', 10)
    .groupBy('a.id')
    .orderBy('listen_time_count', 'desc')
    .limit(10)

  return res.status(200).send(Object.values(audios).map(audio => camelize(audio)))
}
