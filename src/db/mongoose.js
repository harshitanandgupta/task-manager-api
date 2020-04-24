const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true , useUnifiedTopology: true, useCreateIndex:true})



/*const task=new Task({
    description:'Dier',
    completed:true
})*/

/*task.save().then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err)
})*/
