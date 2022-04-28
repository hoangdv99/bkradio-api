import knex from '../../../knexfile.js'
import { camelize } from '../../../utils'

export default async (req, res) => {
  const { id } = req.params

  const existedAudio = await getAudioById(id)
  if (!existedAudio) {
    return res.status(404).send({
      message: 'Audio is not existed'
    })
  }

  return res.status(200).send({ ...existedAudio })
}

const getAudioById = async (id) => {
  const audio = await knex('audios').where('id', '=', id).first()
  if (!audio) return null
  const topicIds = (await knex('audio_topic').where('audio_id', id)).map(topic => topic.topic_id)
  audio.topicIds = topicIds

  return camelize(audio)
}
