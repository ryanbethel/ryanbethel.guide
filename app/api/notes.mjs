import { dirname, join } from 'node:path'
import url from 'node:url'
import { readFileSync } from 'node:fs'
import { getNotes } from '../models/notes.mjs'

/** @type {import('@enhance/types').EnhanceApiFn} */
export async function get(req) {
  const here = dirname(url.fileURLToPath(import.meta.url))

  const notes = await getNotes()
  const formatNotes = notes.map(note=>{
    let date = new Date(note.published);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return {
      ...note, 
      published: date.toLocaleDateString('en-US', options)
    }
  })

  const hCardPath = join(here, 'h-card.json')
  const hCard = JSON.parse(readFileSync(hCardPath, 'utf-8'))

  return {
    json: {
      notes: formatNotes,
      hCard,
    },
  }
}
