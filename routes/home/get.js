import { audioStatus, audioTypes } from "../../constants"
import knex from "../../knexfile"
import { camelize } from "../../utils"

export default async (req, res) => {
  const newUploadedAudios = await getNewUploadedAudios()
  const audiosByTypes = await getAudiosByType()

  return res.status(200).send({
    newUploadedAudios,
    audiosByTypes
  })
}

const getNewUploadedAudios = async () => {
  const newUploadedAudios = await knex.select(
    'id',
    'title',
    'slug',
    'thumbnail_url',
    'author',
  )
    .from('audios')
    .where({ status: audioStatus.public })
    .orderBy('created_at', 'desc')
    .limit(12)

  return Object.values(newUploadedAudios).map(audio => camelize(audio))
}

const getAudiosByType = async () => {
  const audiosByTypes = []
  for (const type of audioTypes) {
    const audios = await knex.select(
      'id',
      'title',
      'slug',
      'thumbnail_url',
      'author',
    )
      .from('audios')
      .where({ type: type.id })
      .orderBy('created_at', 'desc')
      .limit(12)
    audiosByTypes.push({
      type: {
        name: type.name,
        slug: type.slug
      },
      audios: Object.values(audios).map(audio => camelize(audio))
    })
  }

  return audiosByTypes
}
