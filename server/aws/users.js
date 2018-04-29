const aws = require('aws-sdk')

userDB = new aws.DynamoDB({region: 'ap-northeast-1'})

const getUser = (username) => {
  const params = {
    TableName: 'herocu-users',
    Key: {
      username: { S: username }
    }
  }
  return new Promise((resolve, reject) => {
    userDB.getItem(params, (err, data) => {
      if(err) reject(err)
      else resolve(data.Item)
    })
  })
}

const verifyUser = (username, password) => {
  return getUser(username).then(user => {
    if(user === undefined) {
      return Promise.reject({
        type: 'NOT_EXIST',
        message:  `user ${username} does not exist`,
      })
    }
    if(user.password.S === password) {
      return Promise.resolve()
    }
    return Promise.reject({
      type: 'WRONG_PASSWORD',
      message: 'wrong password'
    })
  })
}

module.exports = {
  verifyUser
}
