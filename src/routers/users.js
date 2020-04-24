const express=require('express')
const multer=require('multer')
const sharp=require('sharp')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const Task=require('../models/task')
const mail=require('../emails/account')
router.post('/users',async (req,res) => {
    const user=new User(req.body)
    try{
        await user.save()
        const token=await user.generateAuthToken()
        await mail.sendsignupmail(user.email,user.name)
        res.send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res) => {
    try {
        req.user.tokens=req.user.tokens.filter((token) => {
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})


router.post('/users/logoutall',auth,async (req,res) => {
    try {
        req.user.tokens=[];
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})




router.get('/users/:id' ,async (req,res) =>{
    const id=req.params.id
    try {
        const data=await User.findById(id)
        if(!data)
        res.status(404).send()
        res.send(data)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users',auth,async (req,res) =>{
 
    res.send(req.user)
    
})

router.patch('/users',auth, async (req,res) => {
    const keys=Object.keys(req.body)
    const allowedKeys=['name','email','password','age']
    const isValid=keys.every((key) => allowedKeys.includes(key))
    if(!isValid)
    res.status(400).send("Error!Invalid Updates")

    try {
        const user=await User.findById(req.user._id)
        keys.forEach((key) => user[key]=req.body[key])
        await user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user)
        res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/users',auth,async (req,res) =>{
    try {
        const user=await User.findByIdAndDelete(req.user._id)
        if(!user)
        res.status(404).send()
        await Task.deleteMany({owner:req.user._id})
        mail.senddeletemail(user.email,user.name)
        res.send(user)
    } catch (error) {
        res.status(400).send()
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/))
            return  cb(new Error('Please Upload a Image File'))
        cb(undefined,true)
    }
})

router.post('/users/pic',auth,upload.single('upload'),async (req,res)=>{
    const buffer=await sharp(req.user.avatar).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({
        error:error.message
    })
})


router.delete('/users/pic',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/pic/:id', async (req,res)=>{
    try {
       const user= await User.findById(req.params.id)
       if(!user || !user.avatar)
       throw new Error()
       res.set('Content-Type','image/png')
        res.send(user.avatar)

    } catch (error) {
       res.status(404).send()
    }
})
module.exports=router