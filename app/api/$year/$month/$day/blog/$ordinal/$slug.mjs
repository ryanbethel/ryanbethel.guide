import { dirname, join } from 'node:path'
import { DateToSxg } from 'newbase60'
import url from 'node:url'
import { readFileSync } from 'node:fs'
import { URL } from 'node:url'
import { Arcdown } from 'arcdown'
import HljsLineWrapper from '../../../../../../lib/hljs-line-wrapper.mjs'
import { default as defaultClassMapping } from '../../../../../../lib/markdown-class-mappings.mjs'
import { getWebMentions } from '../../../../../../../shared/webmentions.mjs'

/** @type {import('@enhance/types').EnhanceApiFn} */
export async function get(req) {

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
  // let docPath = activePath.replace(/^\/?blog\//, '') || 'index'
  let docPath = convertToDocPath(activePath) || 'index'
  if (docPath.endsWith('/')) {
    docPath += 'index' // trailing slash == index.md file
  }

  const docURL = new URL(`../../../../../../blog/posts/${docPath}.md`, import.meta.url)

  let docMarkdown
  try {
    docMarkdown = readFileSync(docURL.pathname, 'utf-8')
  } catch (_err) {
    console.log(_err)
    return { statusCode: 404 }
  }
  const post = await arcdown.render(docMarkdown)
  const mentions = (await getWebMentions()).filter(mention => (mention.targetPath === activePath && mention.approved))

  // let here = dirname(url.fileURLToPath(import.meta.url)) 
  let hCardPath = new URL(`../../../../../../api/h-card.json`, import.meta.url)
  let hCard = JSON.parse(readFileSync(hCardPath, 'utf-8'))

  return {
    json: {
      post,
      mentions,
      hCard,
      shortLink: getShortLink(activePath)
    },
  }
}

function getShortLink(path) {
  const shortDomain = process.env.SHORT_DOMAIN || 'http://localhost:3333'
  const parts = path.split('/')

  const year = parts[1]
  const month = parts[2].padStart(2, '0')
  const day = parts[3].padStart(2, '0')
  const type = parts[4]
  const ordinal = parts[5]

  const sxg = DateToSxg(new Date(`${year}-${month}-${day}`))

  const types = {
    blog:'b',
    note:'n',
  }
  return `${shortDomain}/${types[type]}${sxg}${ordinal}`
}

function convertToDocPath(path) {
  const parts = path.split('/')

  const year = parts[1]
  const month = parts[2].padStart(2, '0')
  const day = parts[3].padStart(2, '0')
  const type = parts[4]
  const ordinal = parts[5]
  const slug = parts[6]

  const docPath = `${year}-${month}-${day}-${slug}`

  return docPath
}
