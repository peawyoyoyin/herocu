const git = require('git-wrapper')
const path = require('path')

class GitRepository {
  constructor(options) {
    this._git = new git({ 'git-dir': path.resolve(`./repositories/${options.name}.git`) })
  }

  init(callback) {
    this._git.exec('init', callback)
  }

  listFiles(callback) {
    this._git.exec('ls-files', callback)
  }
}
module.exports = GitRepository
