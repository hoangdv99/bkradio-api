import knex from "../../../knexfile"

export default async (req, res) => {
  const { audioId, userId, rating } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  await updateAudioEverageRating(audioId, rating)
  await updateRatingHistory(audioId, userId, rating)

  return res.sendStatus(200)
}

const updateAudioEverageRating = async (audioId, rating) => {
  const { averageRating, ratingCount } = await knex.select('rating as averageRating', 'rating_count as ratingCount').from('audios')
    .where({ id: audioId })
    .first()

  const updatedRating = (averageRating * ratingCount + rating) / (ratingCount + 1)
  await knex('audios').update({
    rating: updatedRating,
    rating_count: ratingCount + 1
  }).where({ id: audioId })
}

const updateRatingHistory = async (audioId, userId, rating) => {
  await knex('audio_user_ratings').insert({ audio_id: audioId, user_id: userId, rating })
}
