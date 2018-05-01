const git = require('./git')

const repo = new git({
  username: 'admin',
  name: 'test2'
})

console.log(repo.getECStaskID())
