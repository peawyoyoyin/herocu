const aws = require('aws-sdk')
const config = require('./config').config

const ecs = new aws.ECS({ region: 'us-east-1',  credentials: config.ECSCredentials })

const stopECSTask = (taskID, callback, reason='stopped via webUI') => {
  console.log(`stopping task ${taskID} with reason ${reason}`)
  const params = {
    cluster: 'herocu',
    task: taskID,
    reason,
  }
  ecs.stopTask(params, callback)
}

module.exports = {
  stopECSTask
}
