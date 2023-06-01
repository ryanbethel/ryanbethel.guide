import { dirname, join } from 'node:path'
import url from 'node:url'
import { readFileSync } from 'node:fs'
import { getNotes } from '../models/notes.mjs'

/** @type {import('@enhance/types').EnhanceApiFn} */
export async function get(req) {
  const here = dirname(url.fileURLToPath(import.meta.url))
  const base = join(here, 'posts.json')
  const posts = JSON.parse(readFileSync(base, 'utf-8'))
    .reverse()

  const hCardPath = join(here, 'h-card.json')
  const hCard = JSON.parse(readFileSync(hCardPath, 'utf-8'))

  const notes = await getNotes()
  const formatNotes = notes.map(note=>{
    let date = new Date(note.published);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return {
      ...note, 
      published: date.toLocaleDateString('en-US', options)
    }
  })

  const typedPosts = posts.map(post => ({ type: 'blog', content: {...post, ordinal:1} }))
  const typedNotes = formatNotes.map(note => ({ type: 'note', content: note }))
  const combined = [...typedPosts, ...typedNotes]

  combined.sort((a, b) => {
    const dateA = new Date((a.content.published || a.content.frontmatter.published))
    const dateB = new Date((b.content.published || b.content.frontmatter.published))
    console.log({dateA})
    console.log(a.content.published)
    console.log(a.content)
    console.log({dateB})
    console.log(b.content.published)
  
    if (dateA > dateB) return -1
    if (dateA === dateB) return 1

    // if dates are equal, sort by 'ordinal'
    if (a.content.ordinal > b.content.ordinal) return -1 // return highest first
    if (a.content.ordinal < b.content.ordinal) return 1

    return 0
  })

  const parsedLimit = parseInt(req.query.limit, 10)
  const limit = parsedLimit > 0 ? parsedLimit : 20
  const parsedOffset = parseInt(req.query.offset, 10)
  const offset = parsedOffset >= 0 ? parsedOffset : 0
  const total = combined.length


  return {
    json: {
      combined,
      limit,
      offset,
      total,
      hCard,
    },
  }
}
