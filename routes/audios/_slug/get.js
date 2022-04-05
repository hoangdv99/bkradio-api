import knex from '../../../knexfile.js'
import { camelize } from '../../../utils'

export default async (req, res) => {
  const { slug } = req.params
  const { userId } = req.query

  const audio = await getAudioBySlug(slug)
  if (!audio) {
    return res.status(404).send({
      message: 'Audio is not existed'
    })
  }

  const { currentListeningTime } = userId ? camelize(await getListenHistory(userId, audio.id)) : null
  audio.history = currentListeningTime

  return res.status(200).send(audio)
}

const getAudioBySlug = async (slug) => {
  const queryResult = await knex.select(
    'a.id',
    'a.title',
    'a.slug',
    'a.description',
    'a.url',
    'a.thumbnail_url',
    'a.rating',
    'a.views',
    'a.author',
    't.title as topic',
    'v.name as voice',
  ).from('audios as a')
    .leftJoin('audio_topic as at', 'a.id', 'at.audio_id')
    .leftJoin('topics as t', 'at.topic_id', 't.id')
    .leftJoin('voices as v', 'a.voice_id', 'v.id')
    .where('a.slug', slug)

  if (!queryResult.length) return null

  let topics = []
  queryResult.forEach(row => {
    topics.push(row.topic)
    delete row.topic
  })

  const audio = { ...queryResult[0], topics }

  return camelize(audio)
}

const getListenHistory = async (userId, audioId) => {
  const history = await knex.select('current_listening_time')
    .from('histories')
    .where({ user_id: userId, audio_id: audioId })
    .first()

  return history || {}
}