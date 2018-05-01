const git = require('git-wrapper')
const path = require('path')
const fs = require('fs')

class GitRepository {
  constructor(options) {
    const { username, name } = options
    this.username = username
    this.name = name
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

  installHooks(hookFilePath, options = {}) {
    const dest = `./repositories/${this.username}/${this.name}.git/hooks/post-receive`
    fs.copyFileSync(hookFilePath, path.resolve(dest))
    fs.chmodSync(path.resolve(dest), 0o755)
  }

  _readAWStaskinfo() {
    console.log(`reading awstaskinfo from ${path.resolve(`./repositories/${this.username}/${this.name}.git/awstaskinfo`)}`)
    const AWSTaskInfoFilePath = `./repositories/${this.username}/${this.name}.git/awstaskinfo`
    if(fs.existsSync(AWSTaskInfoFilePath)) {
      return fs.readFileSync(AWSTaskInfoFilePath)
    } else {
      return null
    }
  }
  
  _removeAWStaskinfo() {
    const AWSTaskInfoFilePath = `./repositories/${this.username}/${this.name}.git/awstaskinfo`
    if(fs.existsSync(AWSTaskInfoFilePath)) {
      fs.renameSync(AWSTaskInfoFilePath, AWSTaskInfoFilePath+'.stopped')
    }
  }

  getECStaskID() {
    const AWSTaskInfoRaw = this._readAWStaskinfo()
    if(AWSTaskInfoRaw === null) {
      return null
    }
    const [ target, status, address, name ] = AWSTaskInfoRaw.toString().split(/\s+/)
    return target.split('/')[0]
  }
}
module.exports = GitRepository
