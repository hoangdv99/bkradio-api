import knex from '../../knexfile'
import { camelize } from '../../utils';

export default async (req, res) => {
  const queryResult = await knex.select(
    'a.id',
    'a.title',
    'a.description',
    'a.url',
    'a.thumbnail_url',
    'a.rating',
    'a.views',
    'a.status',
    't.title as topic',
    'au.name as author',
    'v.name as voice',
    'u.username as posted_by'
    ).from('audios as a')
    .leftJoin('audio_topic as at', 'a.id', 'at.audio_id')
    .leftJoin('topics as t', 'at.topic_id', 't.id')
    .leftJoin('authors as au', 'a.author_id', 'au.id')
    .leftJoin('voices as v', 'a.voice_id', 'v.id')
    .leftJoin('users as u', 'a.posted_by', 'u.id')
    .orderBy('a.created_at', 'desc')
  const audios = queryResult.reduce((audio, row) => {
    audio[row.id] = audio[row.id] || {
      ...row,
      topics: []
    };
  
    audio[row.id].topics.push(row.topic)
    delete audio[row.id].topic

    return audio
  }, {})

  return res.status(200).send(
    Object.values(audios).map(audio => camelize(audio))
  )
}
