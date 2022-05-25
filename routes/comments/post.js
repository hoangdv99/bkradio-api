import knex from "../../knexfile"

export default async (req, res) => {
  const { audioId, userId, content, isReply, parentCommentId } = req.body
  let result
  if (isReply) {
    result = await saveReply(audioId, userId, content, parentCommentId)
  } else {
    result = await saveComment(audioId, userId, content)
  }

  return res.status(200).send(result)
}

const saveComment = async (audioId, userId, content) => {
  const id = await knex('comments').insert({
    'audio_id': audioId,
    'user_id': userId,
    'content': content,
  })

  return knex.select('c.*', 'u.username')
    .from('comments as c')
    .leftJoin('users as u', 'c.user_id', 'u.id')
    .where('c.id', '=', id)
    .first()
}

const saveReply = async (audioId, userId, content, parentCommentId) => {
  const id = await knex('comments').insert({
    'audio_id': audioId,
    'user_id': userId,
    'content': content,
    'is_reply': 1,
    'parent_comment_id': parentCommentId
  })

  return knex.select('c.*', 'u.username')
    .from('comments as c')
    .leftJoin('users as u', 'c.user_id', 'u.id')
    .where('c.id', '=', id)
    .first()
}
