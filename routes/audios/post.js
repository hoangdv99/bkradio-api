import { roles } from '../../constants'
import knex from '../../knexfile'

export default async (req, res) => {
  const { title, description, author, voiceId, thumbnailUrl, audioUrl, userId, topicIds } = req.body

  if (!title || !author || !voiceId || !audioUrl) {
    return res.status(422).send({
      message: 'Missing fields'
    })
  }

  const audio = {
    title,
    description,
    url: audioUrl,
    author: author,
    thumbnail_url: thumbnailUrl,
    posted_by: userId,
    voice_id: voiceId,
    rating: 0,
    views: 0
  }

  const existedAudio = await knex('audios').where({
    title: title,
    author: author,
    voice_id: voiceId
  })

  if (existedAudio.length) {
    return res.status(409).send({
      message: 'Duplicated audio'
    })
  }

  const audioId = await knex('audios').insert(audio)
  topicIds.forEach(async topicId => {
    await knex('audio_topic').insert({ 'topic_id': topicId, 'audio_id': audioId[0] })
  })

  return res.status(200).send({
    message: 'Created new audio successfully'
  })
}
