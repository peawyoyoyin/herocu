require('./config')()
const repo = require('./repositories')

repo.getRepositoriesOfUser('admin')
  .then(console.log)
  .catch(console.error)
