const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const initPassport = require('./passport')
const passport = require('passport')

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

app.get('/', (req, res) => {
  let renderOptions = {}
  if(req.user !== undefined) {
    renderOptions.user = req.user
  }
  // console.log(renderOptions)
  res.render('index', renderOptions)
})

app.get('/newrepo', (req, res) => {
  if(!req.isAuthenticated()) res.redirect('/login')
  else {
    res.render('new-repo')
  }
})

app.post('/newrepo', (req, res) => {
  if(!req.isAuthenticated()) res.status(401)
  else {
    const repositoryName = req.body.name
    console.log(`new repository ${req.user.username}\\${repositoryName}`)
    res.redirect('/')
  }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  }), 
  (req, res) => {
    res.redirect('/')
  }
)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.listen(8080, () => {
  console.log('listening on port 8080')
})
