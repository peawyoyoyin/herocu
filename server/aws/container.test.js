require('./config')()
const aws = require('aws-sdk')
const ecs = new aws.ECS({ region: 'us-east-1', credentials: new aws.SharedIniFileCredentials({ profile: 'herocu-ecs' }) })
ecs.listTasks({cluster: 'herocu'}, (err, tasks) => {
  ecs.describeTasks({ cluster: 'herocu', tasks: tasks.taskArns }, console.log)
})
ecs.stopTask({
  cluster: 'herocu',
  task: '823d8db3-6e8f-431d-b1ac-ffdf0ac87875',
  reason: 'test stop'
}, (err, data) => {
  console.log(data)
})
