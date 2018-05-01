const express = require('express')

const users = require('../aws/users')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('new-user')
})

router.post('/', (req, res) => {
  if(req.body.username === '' || req.body.password === '') {
    res.status(400).send('invalid username or password')
  }
  users.newUser(req.body.username, req.body.password)
    .then(() => {res.redirect('/login')})
    .catch(() => {res.redirect('/login')})
})

module.exports = router
