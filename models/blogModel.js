const mongoose = require(`mongoose`)
const {ObjectId} = mongoose.Schema

const blogSchema = new mongoose.Schema({
    image:[String],
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    postBy:{
        type:ObjectId,
        ref:`User`,
        required:true
    }
})

const blogModel = mongoose.model(`Blog`,blogSchema)

module.exports = {blogModel}