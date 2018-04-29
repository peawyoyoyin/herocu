const aws = require('aws-sdk')

module.exports = function setupCredentials() {
  const credentials = new aws.SharedIniFileCredentials({ profile: 'default' })
  aws.config.credentials = credentials
}
