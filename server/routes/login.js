const express = require('express')
const passport = require('passport')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', passport.authenticate('local', {
  failureRedirect: '/login',
  }), 
  (req, res) => {
    res.redirect('/')
  }
)

module.exports = router
