import knex from "../../knexfile"

export default async (req, res) => {
  const { audioId, userId, content, isReply, parentCommentId } = req.body
  if (isReply) {
    await saveReply(audioId, userId, content, parentCommentId)
  } else {
    await saveComment(audioId, userId, content)
  }

  return res.sendStatus(200)
}

const saveComment = async (audioId, userId, content) => {
  await knex('comments').insert({
    'audio_id': audioId,
    'user_id': userId,
    'content': content,
  })
}

const saveReply = async (audioId, userId, content, parentCommentId) => {
  await knex('comments').insert({
    'audio_id': audioId,
    'user_id': userId,
    'content': content,
    'is_reply': 1,
    'parent_comment_id': parentCommentId
  })
}
