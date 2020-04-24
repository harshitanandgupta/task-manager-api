const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt= require('bcryptjs')
const jwt=require('jsonwebtoken')
const Userschema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.includes('password'))
            throw new Error('It cannot contain password')
        }
    },

    tokens:[{
        token:{
            type : String,
            required : true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
Userschema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'

})
Userschema.methods.generateAuthToken = async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

Userschema.methods.toJSON =function() {
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

Userschema.statics.findByCredentials = async (email,password) => {
    const user=await User.findOne({email})
   // console.log(user)
    if(!user)
    throw new Error('Unable to Login')

    const isValid=await bcrypt.compare(password,user.password)
    if(!isValid)
    throw new Error('Unable to Login')

    return user
}
Userschema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    user.password=await bcrypt.hash(user.password,8)
    next()
})

const User = mongoose.model('User', Userschema)

module.exports=User