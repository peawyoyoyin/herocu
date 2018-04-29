const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({ 
  secret: 'herocool',
  resave: true,
  saveUninitialized: false,
}))


const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log(`login attempt with user: ${username}, password: ${password}`)
    if(username === 'admin' && password === 'admin') {
      console.log('login success!')
      return done(null, {
        username: 'admin',
        password: 'admin'
      })
    }
    console.log('login failed')
    return done(null, false, {message: 'incorrect ID or password'})
  }
))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, {
    username: 'admin',
    password: 'admin'
  })
})

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  let renderOptions = {}
  if(req.user !== undefined) {
    renderOptions.user = req.user
  }
  console.log(renderOptions)
  res.render('index', renderOptions)
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  }), 
  (req, res) => {
    res.redirect('/')
  })

app.listen(8080, () => {
  console.log('listening on port 8080')
})
