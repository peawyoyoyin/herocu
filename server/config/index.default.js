const aws = require('aws-sdk')
const path = require('path')

module.exports = function setupCredentials() {
  const credentials = new aws.SharedIniFileCredentials({ profile: 'default' })
  aws.config.credentials = credentials
}

module.exports.aws = {
  dynamoDBCredentials : new aws.SharedIniFileCredentials({ profile: 'herocu' }),
  ECSCredentials : new aws.SharedIniFileCredentials({ profile: 'herocu-ecs' })
}

module.exports.server = {
  port: 8080,
  authorizedKeysPath: path.resolve('./repositories/_test/authorized_keys')
}
