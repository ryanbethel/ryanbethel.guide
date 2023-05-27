if (!process.env.arc_env) {
  process.env.arc_env = 'testing'
}
const matter = require('gray-matter');
const { join, parse } = require('path') // eslint-disable-line
const postsDir = (params)=>{
  if (typeof(params) === 'string') return params
  const cwd = params.inventory.inv._project.cwd
  return join(cwd, 'app', 'blog', 'posts')
}

function generate (params) {
  const base = postsDir(params)
  const { readdirSync, readFileSync, writeFileSync } = require('fs') 
  const readingTime = require('reading-time') 

  const posts = readdirSync(base)

  function render (path) {
    const file = readFileSync(join(base, path), 'utf8')
    const result = matter(file)
    result.data.readtime = `${Math.floor(readingTime(file).minutes)} mins`
    return result.data
  }

  function getData (filePath) {
    const frontmatter = render(filePath)
    const parsed = parseFilename(parse(filePath).name) 
    return {
      href: `/${parsed.date.getFullYear()}/${parsed.date.getMonth()+1}/${parsed.date.getDate()}/blog/1/${parsed.slug}`,
      frontmatter
    }
  }

  const cards = []
  for (let path of posts) {
    let card = getData(path)
    cards.push(card)
  }

  let postsJson = join(params.inventory.inv._project.cwd, 'app', 'api', 'posts.json')
  writeFileSync(postsJson, JSON.stringify(cards, null, 2))
}

function parseFilename(filename) {
  const parts = filename.split('-');

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-based
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  const slugParts = parts.slice(3);
  const slug = slugParts.join('-').replace('.md', '');

  return { date, slug };
}

module.exports = {
  sandbox: {
    start: generate,
    watcher: (params) => {
      let { filename } = params
      if (!filename.includes(postsDir(params)) || !filename.endsWith('.md')) {
        return
      }
      generate(params)
    }
  },
  deploy: { 
    start: generate,
  },
}

if (require.main === module) {
  (function () {
    try {
      generate( join(__dirname, 'app', 'blog', 'posts'))
    }
    catch (err) {
      console.log(err)
    }
  })()
}
