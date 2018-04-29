require('./config')()
const users = require('./users')

const testVerifyUser = (username, password) => {
  users.verifyUser(username, password)
    .then(() => {
    console.log(`[${username}:${password}] verified success!`)
    })
    .catch(err => {
      console.log(`[${username}:${password}] verified failed:`)
      console.log(err)
    })
}

testVerifyUser('admin', 'admin')
testVerifyUser('admin', 'wrong')
testVerifyUser('nonexistent', 'anything')
