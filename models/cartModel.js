const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const cartSchema = new mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true,
        ref:`User`
    },
    productId:{
        type:ObjectId,
        required:true,
        ref:`Product`
    },
    quantity:{
        type:Number,
        required:true
    }
},{timestamps:true})

const cartModel = mongoose.model(`Cart`,cartSchema)

module.exports= {cartModel}