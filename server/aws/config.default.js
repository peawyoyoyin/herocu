const aws = require('aws-sdk')

module.exports = function setupCredentials() {
  const credentials = new aws.SharedIniFileCredentials({ profile: 'default' })
  aws.config.credentials = credentials
}

module.exports.config = {
  dynamoDBCredentials : new aws.SharedIniFileCredentials({ profile: 'herocu' }),
  ECSCredentials : new aws.SharedIniFileCredentials({ profile: 'herocu-ecs' })
}
