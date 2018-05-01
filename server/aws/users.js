const aws = require('aws-sdk')
const config = require('../config')

userDB = new aws.DynamoDB({ region: 'ap-northeast-1', credentials: config.aws.dynamoDBCredentials })

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

const newUser = (username, password) => {
  const params = {
    TableName: 'herocu-users',
    Item: {
      username: { S: username },
      password: { S: password },
    }
  }

  return new Promise((resolve, reject) => {
    userDB.putItem(params, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  })
}

module.exports = {
  verifyUser,
  newUser
}
