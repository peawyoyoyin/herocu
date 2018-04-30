const git = require('git-wrapper')
const path = require('path')
const fs = require('fs')

class GitRepository {
  constructor(options) {
    if(!fs.existsSync(path.resolve(`./repositories/${options.username}`))) {
      fs.mkdirSync(`./repositories/${options.username}`)
    }
    this._git = new git({ 'git-dir': path.resolve(`./repositories/${options.username}/${options.name}.git`), bare: true })
  }

  init(callback) {
    this._git.exec('init', callback)
  }

  listFiles(callback, branch='master', directory='') {
    if(branch === null) branch = 'master'
    this._git.exec(`ls-tree ${branch} ${directory}`, callback)
  }
}
module.exports = GitRepository
