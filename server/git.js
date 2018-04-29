const git = require('git-wrapper')
const path = require('path')
const fs = require('fs')

class GitRepository {
  constructor(options) {
    if(!fs.existsSync(path.resolve(`./repositories/${options.username}`))) {
      fs.mkdir(`./repositories/${options.username}`)
    }
    this._git = new git({ 'git-dir': path.resolve(`./repositories/${options.username}/${options.name}.git`) })
  }

  init(callback) {
    this._git.exec('init', callback)
  }

  listFiles(callback) {
    this._git.exec('ls-files', callback)
  }
}
module.exports = GitRepository
