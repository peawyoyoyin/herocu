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

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
}
