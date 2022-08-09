import knex from '../../../../knexfile'
import { camelize } from '../../../../utils'
import { audioStatus } from '../../../../constants'

export default async (req, res) => {
  const { slug } = req.params
  const userId = req.user ? req.user.id : null
  const RELATED_AUDIOS_AMOUNT = 12

  const audio = await getAudioBySlug(slug)
  if (!audio) {
    return res.status(404).send({
      message: 'Audio is not existed'
    })
  }

  const history = camelize(await getListenHistory(userId, audio.id))
  const ratingHistory = await getVotingHistory(audio.id, userId)
  let relatedAudios = await getRelatedAudios(audio)
  if (relatedAudios.length < RELATED_AUDIOS_AMOUNT) {
    const randoms = await getRandomAudios(RELATED_AUDIOS_AMOUNT - relatedAudios.length)
    relatedAudios = [...relatedAudios, ...randoms]
  }

  return res.status(200).send({
    ...audio,
    history,
    ratingHistory,
    relatedAudios
  })
}

const getAudioBySlug = async (slug) => {
  const queryResult = await knex.select(
    'a.id',
    'a.title',
    'a.slug',
    'a.description',
    'links.link',
    'links.id as linkId',
    'a.thumbnail_url',
    'a.rating',
    'a.views',
    'a.author',
    't.title as topic',
    'v.name as voiceName',
    'v.gender as voiceGender',
    'v.region as voiceRegion'
  ).from('audios as a')
    .leftJoin('audio_topic as at', 'a.id', 'at.audio_id')
    .leftJoin('topics as t', 'at.topic_id', 't.id')
    .leftJoin('audio_links as links', 'links.audio_id', 'a.id')
    .leftJoin('voices as v', 'links.voice_id', 'v.id')
    .where('a.slug', slug)
    .where('a.status', '=', audioStatus.public)

  if (!queryResult.length) return null

  let topics = [], links = []
  queryResult.forEach(row => {
    if (row.topic && !topics.includes(row.topic)) topics.push(row.topic)
    if (!links.some(link => link.url === row.link)) {
      links.push({
        id: row.linkId,
        url: row.link,
        voice: {
          name: row.voiceName,
          gender: row.voiceGender === 1 ? 'Nam' : 'Nữ',
          region: getVoiceRegion(row.voiceRegion)
        }
      })
    }
    delete row.topic
    delete row.link
    delete row.voiceName
    delete row.voiceGender
    delete row.voiceRegion
  })

  const audio = { ...queryResult[0], topics, links }
  return camelize(audio)
}

const getListenHistory = async (userId, audioId) => {
  const history = await knex.select(
      'current_listening_time',
      'audio_link_id'
    )
    .from('histories')
    .where({ user_id: userId, audio_id: audioId })
    .first()

  return history || {}
}

const getVotingHistory = async (audioId, userId) => {
  let isRated = false
  const ratingTimes = await knex('audio_user_ratings')
    .count()
    .where('audio_id', '=', audioId)
    .first()
  if (userId) {
    const history = await knex.select('*')
      .from('audio_user_ratings')
      .where('audio_id', '=', audioId)
      .where('user_id', '=', userId)
      .first()
    if (history) isRated = true
  }

  return { ratingTimes: ratingTimes['count(*)'], isRated }
}

const getRelatedAudios = async (audio) => {
  const relatedAudios = await knex.select(
    'id',
    'title',
    'slug',
    'author',
    'thumbnail_url'
  ).from('audios')
  .where('author', '=', audio.author)
  .where('id', '<>', audio.id)
  .orderByRaw('RAND()')
  .limit(9)

  return Object.values(relatedAudios).map(audio => camelize(audio))
}

const getRandomAudios = async (limit) => {
  const audios = await knex.select(
    'id',
    'title',
    'slug',
    'author',
    'thumbnail_url'
  ).from('audios')
  .orderByRaw('RAND()')
  .limit(limit)

  return Object.values(audios).map(audio => camelize(audio))
}

const getVoiceRegion = (value) => {
  if (value === 1) return 'Miền Bắc'
  else if (value === 2) return 'Miền Trung'
  else return 'Miền Nam'
}
