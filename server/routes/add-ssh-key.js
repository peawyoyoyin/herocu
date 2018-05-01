const express = require('express')

const router = express.Router()
const config = require('../config')
const fs = require('fs')

router.get('/', (req, res) => {
  if(!req.isAuthenticated()) res.redirect('/login')
  else res.render('add-ssh-key', { user: req.user })
})

router.post('/', (req, res) => {
  const { content } = req.body
  fs.appendFileSync(config.server.authorizedKeysPath, '\n'+content.trim())
  res.redirect('/')
})

module.exports = router
