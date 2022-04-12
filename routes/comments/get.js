import knex from "../../knexfile"
import { camelize } from '../../utils'

export default async (req, res) => {
  const { audioId, page, perPage } = req.query

  const comments = await getCommentsByAudioId(audioId, page, perPage)

  return res.status(200).send(comments)
}

const getCommentsByAudioId = async (audioId, page, perPage) => {
  const { data, pagination } = await knex.select(
      'c.*',
      'u.username'    
    )
    .from('comments as c')
    .leftJoin('users as u', 'c.user_id', 'u.id')
    .where('c.audio_id', '=', audioId)
    .where('c.parent_comment_id', null)
    .orderBy('c.created_at', 'desc')
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })

  const comments = Object.values(data).map(row => camelize(row))
  for(let i = 0; i < comments.length; i++) {
    // comments[i].entityLikes = await getEntityLikes(comments[i].id)
    comments[i].replies = await getReplies(comments[i].id)
    comments[i].showReplies = false
    comments[i].showReplyInput = false
  }

  return {comments, pagination}
}

const getReplies = async (commentId) => {
  const queryResult = await knex.select(
    'c.*',
    'u.username'
  )
  .from('comments as c')
  .leftJoin('users as u', 'c.user_id', 'u.id')
  .where('parent_comment_id', '=', commentId)
  .orderBy('c.created_at', 'desc')

  return Object.values(queryResult).map(row => camelize(row))
}

// const getEntityLikes = async (commentId) => {
//   const queryResult = await knex('entity_likes').where('comment_id', '=', commentId)
//   const entityLikes = Object.values(queryResult).map(row => camelize(row))
//   const likes = entityLikes.filter(e => e.isDislike === 0)
//   const dislikes = entityLikes.filter(e => e.isDislike === 1)

//   return { likes: likes.length, dislikes: dislikes.length }
// }
