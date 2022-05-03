import knex from '../../../knexfile.js'
import { audioStatus } from '../../../constants.js'

export default async (req, res) => {
  if (req.user.roleId !== roles.admin) {
    return res.status(403).send({
      message: 'Forbidden'
    })
  }
  
  const { id } = req.params
  const audio = await knex('audios').where({ id })

  if (!audio.length) return res.sendStatus(404)

  await knex('audios').where({ id }).update({
    status: audioStatus.deactived
  })

  return res.sendStatus(200)
}
