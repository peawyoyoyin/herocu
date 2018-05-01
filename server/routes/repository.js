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
          repo.init((err, msg) => {
            console.log(msg)
            repo.installHooks('./server/hook-prototype/post-receive')
            res.redirect('/')            
          })
        }
      )
      .catch(err => {
        console.log('error on creating new repository:', err)
        res.redirect('/')
      })
  }
})
  
router.get('/view/:username/:reponame', (req, res) => {
  const repo = new git({username: req.params.username, name: req.params.reponame})
  repo.listFiles((err, msg) => {
    if(err) {
      res.status(404).end()
    }
    
    const files = msg.split('\n').slice(0, -1).map(line => {
      const [mode, type, hash, name] = line.split(/\s+/)
      return { mode, type, hash, name }
    })
    res.render('view-repo', { repository: { username: req.params.username, name: req.params.reponame, files } })
  })
})

module.exports = router
