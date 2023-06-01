// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { getNote, upsertNote, validate } from '../../../models/notes.mjs'


/**
 * @type {EnhanceApiFn}
 */
export async function get (req) {
  const authorized = !!(req.session.authorized)
  if (!authorized) return { location: '/login' }

  if (req.session.problems) {
    let { problems, note, ...session } = req.session
    return {
      session,
      json: { problems, note }
    }
  }

  const id = req.pathParameters?.id
  const result = await getNote(id)
  return {
    json: { note: result }
  }
}

/**
 * @type {EnhanceApiFn}
 */
export async function post (req) {
  const authorized = !!(req.session.authorized)
  if (!authorized) return { status: 401 }

  const id = req.pathParameters?.id

  const session = req.session
  // Validate
  let { problems, note } = await validate.update(req)
  if (problems) {
    return {
      session: {...session, problems, note },
      json: { problems, note },
      location: `/admin/notes/${note.key}`
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, note: removed, ...newSession } = session
  try {
    const result = await upsertNote({ key: id, ...note })
    return {
      session: newSession,
      json: { note: result },
      location: '/admin/notes'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      json: { error: err.message },
      location: '/admin/notes'
    }
  }
}
