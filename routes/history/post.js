import knex from "../../knexfile"

export default async (req, res) => {
  const { audioId, userId, time, audioLength } = req.body

  if (!userId) {
    return res.sendStatus(403)
  }

  const existedLog = await knex.select('*')
    .from('histories')
    .where({ audio_id: audioId, user_id: userId })
    .first()

  if (!existedLog) {
    await knex('histories').insert({
      audio_id: audioId,
      user_id: userId,
      current_listening_time: time,
      listened_percent: audioLength ? (time / audioLength) * 100 : 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    })
  } else {
    await knex('histories').update({
      current_listening_time: time,
      listened_percent: (time / audioLength) * 100,
      updated_at: knex.fn.now()
    }).where({ audio_id: audioId, user_id: userId })
  }

  return res.sendStatus(200)
}
