const express=require('express')
const Task=require('../models/task')
const router=new express.Router()
const auth=require('../middleware/auth')
router.post('/tasks', auth,async (req,res) => {
    //const task=new Task(req.body);
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send()
    }
    
})





router.get('/task',auth,async (req,res) =>{
    const match={}
    const sort={}

    if(req.query.completed)
    {
        if(req.query.completed == 'true')
        match.completed =true
        else
        match.completed=false
    }
    if(req.query.sortBy)
    {
        const s=req.query.sortBy.split('_')
        sort[s[0]]=s[1] == 'asc'?1:-1
    }
    
    try {
        // const data=await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch (error) {
        res.status(500).send()
        
    }
    
})

router.get('/task/:id' ,auth,async (req,res) =>{
    const _id=req.params.id
    try {
        const data=await Task.findOne({_id,owner:req.user._id})
        if(!data)
        res.status(404).send()
        res.send(data)
    } catch (error) {
        res.status(500).send() 
    }
})




router.patch('/tasks/:id' ,auth,async (req,res) => {
    const keys=Object.keys(req.body)
    //console.log(req.body)
    //console.log(req.params.id)
    const allowedKeys=['description','completed']
    const isValid=keys.every((key) => allowedKeys.includes(key))
    if(!isValid)
    res.status(400).send("Error!Invalid Update")
    try {
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        keys.forEach((key) => task[key]=req.body[key])
        await task.save()
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task)
        res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(400).send()
    }
}) 



router.delete('/tasks/:id',auth,async (req,res) =>{
    try {
        const user=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!user)
        res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(400).send()
    }
})



module.exports=router