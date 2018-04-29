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

const testNewUser = (username, password) => {
  users.newUser(username, password)
    .then(data => {
      console.log('newUser success!', data)
    })
    .catch(err => {
      console.log('newUser error: ', err)
    })
}

testVerifyUser('admin', 'admin')
testVerifyUser('admin', 'wrong')
testVerifyUser('nonexistent', 'anything')
testNewUser('peaw', 'yoyoyin')
testNewUser('peaw', 'yoyoyin2')
