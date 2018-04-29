const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const users = require('./aws/users')

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log(`login attempt with user: ${username}, password: ${password}`)
    users.verifyUser(username, password).then(() => {
      console.log('login success')
      done(null, {
        username, password
      })
    }).catch(err => {
      console.log('login failed with error: ', err)
      done(null, false, { message: 'incorrect ID or password' })
    })
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
