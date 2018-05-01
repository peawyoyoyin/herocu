const express = require('express')
const passport = require('passport')

const repoDB = require('../aws/repositories')
const containers = require('../aws/container')


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

router.get('/stop-task/:username/:reponame', (req, res) => {
  if(!req.isAuthenticated() || req.user.username !== req.params.username) {
    res.status(401).send('Unauthorized')
    return
  }
  const repo = new git({username: req.params.username, name: req.params.reponame})
  const taskID = repo.getECStaskID()
  if(taskID === null) {
    res.status(400).send('taskID not found')
    return
  }
  containers.stopECSTask(taskID, (err, msg) => {
    console.log(msg)
    repo._removeAWStaskinfo()
    res.redirect('/')
  })
})
  
router.get('/view/:username/:reponame', (req, res) => {
  const repo = new git({username: req.params.username, name: req.params.reponame})
  repo.listFiles((err, msg) => {
    if(err) {
      res.status(404)
    }
    
    const files = msg.split('\n').slice(0, -1).map(line => {
      const [ mode, type, hash, name ] = line.split(/\s+/)
      return { mode, type, hash, name }
    })

    const ecsTaskID = repo.getECStaskID()
    res.render('view-repo', { repository: { username: req.params.username, name: req.params.reponame, files, ecsTaskID } })
  })
})

module.exports = router
