try {
  require('./config')()
} catch(e) {
  console.error('error importing config.')
  console.error('make sure server/config/index.js exist.\nIf it\'s not, create one using server/config/index.default.js as an example.')
  process.exit(1)
}

const config = require('./config')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const initPassport = require('./passport')
const passport = require('passport')

const login = require('./routes/login')
const repository = require('./routes/repository')
const newUser = require('./routes/new-user')
const addSSHKey = require('./routes/add-ssh-key')

const repoDB = require('./aws/repositories')
const git = require('./git')

const app = express()

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({ 
  secret: 'herocool',
  resave: true,
  saveUninitialized: false,
}))

initPassport(app)

app.get('/', async (req, res) => {
  let renderOptions = {}
  if(req.user !== undefined) {
    renderOptions.user = req.user
    let userRepos = await repoDB.getRepositoriesOfUser(req.user.username)
    userRepos = userRepos.map(repoinfo => {
      const repo = new git({ username: req.user.username, name: repoinfo.repositoryName })
      if(repo.getECStaskID() !== null) {
        return {
          task: true,
          ...repoinfo,
        }
      }
      return repoinfo
    })
    renderOptions.user.repos = userRepos
  }
  // console.log(renderOptions)
  res.render('index', renderOptions)
})

app.use('/login', login)
app.use('/repo', repository)
app.use('/newuser', newUser)
app.use('/add-ssh-key', addSSHKey)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.listen(config.server.port, () => {
  console.log(`listening on port ${config.server.port}`)
})
