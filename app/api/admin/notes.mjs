// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { getNotes, upsertNote, validate } from '../../models/notes.mjs'


/**
 * @type {EnhanceApiFn}
 */
export async function get (req) {
  const authorized = !!(req.session.authorized)
  if (!authorized) return { location: '/login' }

  const notes = await getNotes()
  if (req.session.problems) {
    let { problems, note, ...session } = req.session
    return {
      session,
      json: { problems, notes, note }
    }
  }

  return {
    json: { notes }
  }
}

/**
 * @type {EnhanceApiFn}
 */
export async function post (req) {
  const authorized = !!(req.session.authorized)
  if (!authorized) return { status: 401 }

  const session = req.session
  // Validate
  let { problems, note } = await validate.create(req)
  if (problems) {
    return {
      session: { ...session, problems, note },
      json: { problems, note },
      location: '/admin/notes'
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, note: removed, ...newSession } = session
  try {
    const result = await upsertNote(note)
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
