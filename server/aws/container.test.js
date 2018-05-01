require('./config')()
const aws = require('aws-sdk')
ecs.listTasks({cluster: 'herocu'}, (err, tasks) => {
  ecs.describeTasks({ cluster: 'herocu', tasks: tasks.taskArns }, console.log)
})
