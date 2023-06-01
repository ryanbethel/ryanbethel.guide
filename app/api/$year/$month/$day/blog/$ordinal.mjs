import {globSync} from 'glob'
import { URL } from 'node:url'

export async function get(req) {


  const { path: activePath } = req
  // let docPath = activePath.replace(/^\/?blog\//, '') || 'index'
  let docPath = convertToDocPath(activePath) || 'index'
  if (docPath.endsWith('/')) {
    docPath += 'index' // trailing slash == index.md file
  }

  const docDir = new URL(`../../../../../blog/posts/**/*.md`, import.meta.url)
  const docs = globSync(docDir.pathname)
  const partDocURL = new URL(`../../../../../blog/posts/${docPath}`, import.meta.url)
  const fullDocPath = docs.find(d=>d.startsWith(partDocURL.pathname))
  const slug = fullDocPath.replace(partDocURL.pathname+'-', '').replace('.md','')

  return {
    status:302,
    location: activePath+'/'+slug
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
