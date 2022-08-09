import knex from '../../knexfile'
import { audioStatus, audioTypes } from '../../constants'
import { camelize } from '../../utils'

export default async (req, res) => {
  const { page, perPage, topic, voice, searchKeyword, type, allViewMode } = req.query

  const queryResult = await knex.select(
    'a.id',
    'a.title',
    'a.slug',
    'a.description',
    'a.thumbnail_url',
    'a.rating',
    'a.views',
    'a.status',
    'a.author',
    'a.created_at',
    'a.updated_at',
    't.title as topic',
    't.slug as topicSlug',
    'v.name as voice',
    'u.username as posted_by'
  ).from('audios as a')
    .leftJoin('audio_topic as at', 'a.id', 'at.audio_id')
    .leftJoin('topics as t', 'at.topic_id', 't.id')
    .leftJoin('users as u', 'a.posted_by', 'u.id')
    .leftJoin('audio_links as links', 'links.audio_id', 'a.id')
    .leftJoin('voices as v', 'links.voice_id', 'v.id')
    .modify(function (queryBuilder) {
      if (topic) queryBuilder.where('t.slug', '=', topic)
      if (voice) queryBuilder.where('v.slug', '=', voice)
      if (type) queryBuilder.where('a.type', '=', getTypeIdBySlug(type))
      if (searchKeyword) queryBuilder.whereRaw(`concat(a.author, ' ', a.title) like '%${searchKeyword}%'`)
      if (allViewMode) queryBuilder.where('a.status', '<>', audioStatus.deactived)
      if (!allViewMode) queryBuilder.where('a.status', '=', audioStatus.public)
    })
    .orderBy('a.created_at', 'desc')
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
  let audios = queryResult.data.reduce((audio, row) => {
    audio[row.id] = audio[row.id] || {
      ...row,
      topics: []
    };

    audio[row.id].topics.push(row.topic)
    delete audio[row.id].topic

    return audio
  }, {})

  return res.status(200).send({
    audios: Object.values(audios).map(audio => camelize(audio)),
    pagination: queryResult.pagination
  })
}

const getTypeIdBySlug = (slug) => {
  const type = audioTypes.find(e => e.slug === slug)
  return type.id
}