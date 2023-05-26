import { dirname, join } from 'node:path'
import {globSync} from 'glob'
import url from 'node:url'
import { readFileSync, readdirSync } from 'node:fs'
import { URL } from 'node:url'
import { Arcdown } from 'arcdown'
import HljsLineWrapper from '../../../../../../../../../../app/lib/hljs-line-wrapper.mjs'
import { default as defaultClassMapping } from '../../../../../../../../../../app/lib/markdown-class-mappings.mjs'
import { getWebMentions } from '../../../../../../../../../../shared/webmentions.mjs'

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

  const docDir = new URL(`../../../../../../../../../../app/blog/posts/**/*.md`, import.meta.url)
  const docs = globSync(docDir.pathname)
  const partDocURL = new URL(`../../../../../../../../../../app/blog/posts/${docPath}`, import.meta.url)
  const fullDocPath = docs.find(d=>d.startsWith(partDocURL.pathname))

  let docMarkdown
  try {
    docMarkdown = readFileSync(fullDocPath, 'utf-8')
  } catch (_err) {
    console.log(_err)
    return { statusCode: 404 }
  }
  const post = await arcdown.render(docMarkdown)
  const mentions = (await getWebMentions()).filter(mention => (mention.targetPath === activePath && mention.approved))

  // let here = dirname(url.fileURLToPath(import.meta.url)) 
  let hCardPath = new URL(`../../../../../../../../../../app/api/h-card.json`, import.meta.url)
  let hCard = JSON.parse(readFileSync(hCardPath, 'utf-8'))

  return {
    json: {
      post,
      mentions,
      hCard
    },
  }
}

function convertToDocPath(path) {
  const parts = path.split('/')

  const year = parts[1]
  const month = parts[2].padStart(2, '0')
  const day = parts[3].padStart(2, '0')
  const type = parts[4]
  const ordinal = parts[5]
  const slug = parts[6]

  const docPath = slug ? `${year}-${month}-${day}-${slug}` : `${year}-${month}-${day}` 

  return docPath
}
