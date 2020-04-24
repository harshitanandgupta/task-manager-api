const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

const connectionURL= 'mongodb://127.0.0.1:27017'
const databaseName='TaskManager'
MongoClient.connect(connectionURL, { useNewUrlParser: true ,useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }
    console.log("Connected")
    const db = client.db(databaseName)
    
    /*db.collection('users').insertOne({
        name: 'Andrew',
        age: 27
    })
    db.collection('users').insertOne({
        name: 'harshit',
        age: 20
    })*/
    /*db.collection('tasks').insertMany([
        {
            description:'Homework',
            completed:false
        },
        {
            description:'Lunch',
            completed:true
        },
        {
            description:'LIC',
            completed:false
        },
    ],(error,result)=>{
        if(error)
        return console.log('Cant Add to DB')
        console.log(result.ops)
    })*/

    db.collection('tasks').find({completed:false}).toArray((error,todos)=>{
        console.log(todos)
    })

    /*db.collection('tasks').updateMany({completed:false},{
        $set:{completed:true}
    }).then((result)=>{
        console.log(result)
    }).catch((err)=>{
        console.log(err)
    })*/

    db.collection('tasks').deleteOne({description:'Homework'}).then((result) =>{
        console.log(result.deletedCount)
    }).catch((err) => {
        console.log(err)
    })
})