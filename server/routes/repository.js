const express = require('express')
const passport = require('passport')

const repoDB = require('../aws/repositories')

const git = require('../git')

const router = express.Router()

router.get('/new', (req, res) => {
  if(!req.isAuthenticated()) res.redirect('/login')
  else {
    res.render('new-repo')
  }
})

router.post('/new', (req, res) => {
  if(!req.isAuthenticated()) res.status(401)
  else {
    const repositoryName = req.body.name
    console.log(`new repository ${req.user.username}\\${repositoryName}`)
    repoDB.createNewRepository(req.user.username, repositoryName)
      .then(
        () => {
          const repo = new git({
            name: `${repositoryName}`,
            username: req.user.username
          })
          repo.init((err, msg) => console.log(msg))
        }
      )
      .catch(err => {
        console.log('error on creating new repository:', err)
      })
    res.redirect('/')
  }
})
  
router.get('/view/:username/:reponame', (req, res) => {
  const repositoryName = req.params.reponame
  res.render('view-repo', {repository: {name: repositoryName}})
})

module.exports = router
