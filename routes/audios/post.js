import slugify from 'slugify'
import { roles } from '../../constants'
import knex from '../../knexfile'

export default async (req, res) => {
  const { title, description, author, voiceId, thumbnailUrl, audioUrl, userId, topicIds, type } = req.body
  
  if (req.user.roleId !== roles.admin) {
    return res.status(403).send({
      message: 'Forbidden'
    })
  }

  if (!title || !author || !audioUrl) {
    return res.status(422).send({
      message: 'Missing fields'
    })
  }

  const slug = slugify(title + ' ' + author, { lower: true, locale: 'vi' })

  const audio = {
    title,
    slug,
    description,
    url: audioUrl,
    author: author,
    thumbnail_url: thumbnailUrl,
    posted_by: userId,
    voice_id: voiceId,
    rating: 0,
    views: 0,
    type
  }

  const existedAudio = await knex('audios').where({ slug })

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
