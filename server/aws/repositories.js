const aws = require('aws-sdk')

const repoDB = new aws.DynamoDB({ region: 'ap-northeast-1' })

const getRepositoriesOfUser = (username) => {
  const params = {
    TableName: 'herocu-repositories',
    ExpressionAttributeValues: {
      ':user': { S: username }
    },
    KeyConditionExpression: 'username = :user',
  }

  return new Promise((resolve, reject) => {
    repoDB.query(params, (err, data) => {
      if(err) reject(err)
      else { 
        resolve(data.Items.map(item => {
          return {
            repositoryName: item['repository-name'].S,
            username: item['username'].S
          }
        }))
      }
    })
  })
}

const createNewRepository = (username, repositoryName) => {
  const params = {
    TableName: 'herocu-repositories',
    Item: {
      username: { S: username },
      'repository-name': { S: repositoryName },
    }
  }

  return new Promise((resolve, reject) => {
    repoDB.putItem(params, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  })
}

module.exports = {
  getRepositoriesOfUser,
  createNewRepository
}
