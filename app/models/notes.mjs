import data from '@begin/data'
import { validator } from '@begin/validator'
import { Note } from './schemas/note.mjs'

const deleteNote = async function (key) {
  await data.destroy({ table: 'notes', key })
  return { key }
}

const upsertNote = async function (note) {
  return data.set({ table: 'notes', ...note })
}

const getNote = async function (key) {
  return data.get({ table: 'notes', key })
}

const getNotes = async function () {
  const databasePageResults = await data.page({
    table: 'notes',
    limit: 25
  })

  let notes = []
  for await (let databasePageResult of databasePageResults) {
    for (let note of databasePageResult) {
      delete note.table
      notes.push(note)
    }
  }

  return notes
}

const validate = {
  shared (req) {
    return validator(req, Note)
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, note: data } : { note: data }
  },
  async update (req) {
    let { valid, problems, data } = validate.shared(req)
    // Insert your custom validation here
    return !valid ? { problems, note: data } : { note: data }
  }
}

export {
  deleteNote,
  getNote,
  getNotes,
  upsertNote,
  validate
}
