const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:Number,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    },
    otpExpires:{
        type:Date
    },
    
},{timestamps:true})

const userModel = mongoose.model('User',userSchema)

module.exports = {userModel}