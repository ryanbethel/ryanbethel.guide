const path = require('path')
const checkDates = require('./check-dates.js')
function postsDir({inventory}){
  const cwd = inventory.inv._project.cwd
  return path.join(cwd, 'app', 'blog', 'posts')
}

module.exports = {
  sandbox: { 
    start: (params)=>{
      checkDates(postsDir(params))
    },
    watcher: (params) => {
      let { filename } = params
      if (!filename.includes(postsDir(params)) || !filename.endsWith('.md')) {
        return
      }
      checkDates(postsDir(params))
    }
  },
  deploy: { 
    start: (params)=>{
      checkDates(postsDir(params))
    }
  },
  set: {
    http() {
      return [
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
          path: '/shorten/*',
          src: path.join(__dirname, 'routes', 'shorten'),
          config: {
            // shared: false,
            views: true,
          }
        },

      ]
    }

  }
}
