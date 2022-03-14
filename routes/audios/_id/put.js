import knex from '../../../knexfile.js'
import { toSnakeCase } from "../../../utils"

export default async (req, res) => {
  const { id, topic_ids, ...formattedAudio} = toSnakeCase(req.body)
  formattedAudio.updated_at = knex.fn.now()
  await knex.transaction(async trx => {
    await knex('audios').transacting(trx).where({ id }).update(formattedAudio)
    await Promise.all(updateAudioTopics(id, topic_ids, trx))
  })

  return res.sendStatus(200)
}

const updateAudioTopics = (audioId, topicIds, trx) => {
  const deletedAudioTopics = knex('audio_topic')
    .transacting(trx)
    .where('audio_id', audioId)
    .del()

  const updatedAudioTopics = topicIds.map(topicId => {
    return knex('audio_topic')
      .transacting(trx)
      .insert({ audio_id: audioId, topic_id: topicId })
  })

  return [deletedAudioTopics, ...updatedAudioTopics]
}
