const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const commentSchema = new mongoose.Schema({
    blog: {
        type:ObjectId,
        ref:'Blog',
        required:true
    },
    user: {
        type:ObjectId,
        ref:'User',
        required:true
    },
    title: {
        type:String,
        required:true,
        trim:true
    }
})

const commentModel = mongoose.model('Comment',commentSchema)

module.exports = {commentModel}