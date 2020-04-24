const express=require('express')
require('./db/mongoose')
const UserRouter=require('./routers/users')
const TaskRouter=require('./routers/tasks')


const app=express();
const port=process.env.PORT
console.log(process.env.NEWW)
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

const User=require('./models/user')
const Task=require('./models/task')

const trying=async () => {
    const user=await User.findById('5e9bf8901658db1698c5574e')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
//trying()

app.listen(port,() => {
    console.log('Port is Running on ' + port)
})
