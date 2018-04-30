try {
  require('./aws/config')()
} catch(e) {
  console.error('error importing config.')
  console.error('make sure server/aws/config.js exist.\nIf it\'s not, create one using server/aws/config.default.js as an example.')
  process.exit(1)
}

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const initPassport = require('./passport')
const passport = require('passport')

const login = require('./routes/login')
const repository = require('./routes/repository')
const newUser = require('./routes/new-user')

const repoDB = require('./aws/repositories')

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
    const userRepos = await repoDB.getRepositoriesOfUser(req.user.username)
    renderOptions.user.repos = userRepos
  }
  // console.log(renderOptions)
  res.render('index', renderOptions)
})

app.use('/login', login)
app.use('/repo', repository)
app.use('/newuser', newUser)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.listen(8080, () => {
  console.log('listening on port 8080')
})
