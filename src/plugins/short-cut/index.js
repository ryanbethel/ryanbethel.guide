const path = require('path')
const checkDates = require('./check-dates.js')
const generate = require('./create-post-metadata.js')
function postsDir({inventory}){
  const cwd = inventory.inv._project.cwd
  return path.join(cwd, 'app', 'blog', 'posts')
}

module.exports = {
  sandbox: { 
    start: (params)=>{
      generate(params)
      checkDates(postsDir(params))
    },
    watcher: (params) => {
      let { filename } = params
      if (!filename.includes(postsDir(params)) || !filename.endsWith('.md')) {
        return
      }
      generate(params)
      checkDates(postsDir(params))
    }
  },
  deploy: { 
    start: (params)=>{
      generate(params)
      checkDates(postsDir(params))
    }
  },
  set: {
    http() {
      const startYear = 2018
      const currentYear = new Date().getFullYear()
      // Array of years from startYear to currentYear
      const years = Array.from({length: currentYear - startYear + 1}, (_, i) => i + startYear)
      const yearRoutes = years.map(year => ({
        method: 'get',
        path: `/${year}/*`,
        src: path.join(__dirname, 'routes', 'year'),
        config: { views: true }
      }))
      return [
        ...yearRoutes,
        {
          method: 'get',
          path: '/:shortcut',
          src: path.join(__dirname, 'routes', 'shortcut'),
          config: {
            // shared: false,
            views: true,
          }
        },
        {
          method: 'get',
          path: '/',
          src: path.join(__dirname, 'routes', 'index'),
          config: {
            // shared: false,
            views: true,
          }
        },
        {
          method: 'get',
          path: '/short',
          src: path.join(__dirname, 'routes', 'short'),
          config: {
            // shared: false,
            views: true,
          }
        },

      ]
    }

  }
}
