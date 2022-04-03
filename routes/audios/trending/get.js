import knex from "../../../knexfile"
import { camelize } from '../../../utils'
import { audioStatus } from '../../../constants'

export default async (req, res) => {
  const period = req.query.period
  if (period === 'all') {
    const audios = await knex.select(
      'id',
      'title',
      'author',
      'thumbnail_url',
      'slug'
    )
      .from('audios')
      .where({ status: audioStatus.public })
      .orderBy('views', 'desc')
      .limit(10)

    return res.status(200).send(Object.values(audios).map(audio => camelize(audio)))
  }
}
