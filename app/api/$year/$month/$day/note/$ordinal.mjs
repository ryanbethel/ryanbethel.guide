import { readFileSync } from 'node:fs'
import { getNotes } from '../../../../../models/notes.mjs'
import calcShortLink from 'enhance-short/calc-short-link/index.js'
import { URL } from 'node:url'
import { Arcdown } from 'arcdown'
import HljsLineWrapper from '../../../../../lib/hljs-line-wrapper.mjs'
import { default as defaultClassMapping } from '../../../../../lib/markdown-class-mappings.mjs'
import { getWebMentions } from '../../../../../../shared/webmentions.mjs'

/** @type {import('@enhance/types').EnhanceApiFn} */
export async function get(req) {
  const { year, month, day, ordinal } = req.pathParameters
  const notes = await getNotes()
  const date = new Date(`${year}-${month}-${day}`)
  const note = notes.find(note => (areDatesSameDay(date, note.published) && ordinal === note.ordinal.toString()))

  // reinvoked each req so no weird regexp caching
  const arcdown = new Arcdown({
    pluginOverrides: {
      markdownItToc: {
        containerClass: 'toc mb2 ml-2',
        listType: 'ul',
      },
      markdownItClass: defaultClassMapping,
    },
    hljs: {
      sublanguages: { javascript: ['xml', 'css'] },
      plugins: [new HljsLineWrapper({ className: 'code-line' })],
    },
  })

  const { path: activePath } = req

  const rendered = await arcdown.render(note.text)
  const mentions = (await getWebMentions()).filter(mention => (mention.targetPath === activePath && mention.approved))

  // let here = dirname(url.fileURLToPath(import.meta.url)) 
  let hCardPath = new URL(`../../../../../api/h-card.json`, import.meta.url)
  let hCard = JSON.parse(readFileSync(hCardPath, 'utf-8'))


  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return {
    json: {
      note: {
        ...note,
        html: rendered.html,
        published: date.toLocaleDateString('en-US', dateOptions)
      },
      mentions,
      hCard,
      shortLink: calcShortLink(activePath)
    },
  }
}

function areDatesSameDay(date1, date2) {
  const _date1 = new Date(date1)
  const _date2 = new Date(date2)
  return _date1.toISOString().slice(0, 10) === _date2.toISOString().slice(0, 10);
}

