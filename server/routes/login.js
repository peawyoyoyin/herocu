const express = require('express')
const passport = require('passport')

const router = express.Router()

app.get('/', (req, res) => {
  res.render('login')
})

app.post('/', passport.authenticate('local', {
  failureRedirect: '/login',
  }), 
  (req, res) => {
    res.redirect('/')
  }
)

module.exports = router
