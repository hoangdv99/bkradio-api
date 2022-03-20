import _ from 'lodash'
import knex from '../../knexfile'
import { audioStatus } from '../../constants'
import { camelize } from '../../utils'

export default async (req, res) => {
  const queryResult = await knex.select(
    'a.id',
    'a.title',
    'a.slug',
    'a.description',
    'a.url',
    'a.thumbnail_url',
    'a.rating',
    'a.views',
    'a.status',
    'a.author',
    'a.created_at',
    'a.updated_at',
    't.title as topic',
    'v.name as voice',
    'u.username as posted_by'
    ).from('audios as a')
    .leftJoin('audio_topic as at', 'a.id', 'at.audio_id')
    .leftJoin('topics as t', 'at.topic_id', 't.id')
    .leftJoin('voices as v', 'a.voice_id', 'v.id')
    .leftJoin('users as u', 'a.posted_by', 'u.id')
    .where('a.status', '<>', audioStatus.deactived)
  let audios = queryResult.reduce((audio, row) => {
    audio[row.id] = audio[row.id] || {
      ...row,
      topics: []
    };
  
    audio[row.id].topics.push(row.topic)
    delete audio[row.id].topic

    return audio
  }, {})

  audios = _.orderBy(audios, ['created_at'], ['desc'])

  return res.status(200).send(
    Object.values(audios).map(audio => camelize(audio))
  )
}
