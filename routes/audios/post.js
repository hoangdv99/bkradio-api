import slugify from 'slugify'
import { roles } from '../../constants'
import knex from '../../knexfile'

export default async (req, res) => {
  const { title, description, author, links, thumbnailUrl, userId, topicIds, type } = req.body
  
  if (req.user.roleId !== roles.admin) {
    return res.status(403).send({
      message: 'Forbidden'
    })
  }

  if (!title || !author || !links.length) {
    return res.status(422).send({
      message: 'Missing fields'
    })
  }

  const slug = slugify(title + ' ' + author, { lower: true, locale: 'vi' })

  const audio = {
    title,
    slug,
    description,
    author: author,
    thumbnail_url: thumbnailUrl,
    posted_by: userId,
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

  await knex.transaction(async trx => {
    const audioId = await knex('audios').insert(audio)
    const insertLinks = links.map(link => ({
      audio_id: audioId,
      voice_id: link.voiceId,
      link: link.link
    }))
    const insertTopics = topicIds.map(topicId => ({
      topic_id: topicId,
      audio_id: audioId
    }))
    await knex('audio_links').transacting(trx).insert(insertLinks)
    await knex('audio_topic').transacting(trx).insert(insertTopics)
  })

  return res.status(200).send({
    message: 'Created new audio successfully'
  })
}
