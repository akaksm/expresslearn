const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:[true,`The title is required`],
        trim:true,
        min:[3,`Title must have more than three characters`],
        max:[20,`Title is too long`]
    },
    productPrice:{
        type:Number,
        required:true,
        trim:true
    },
    countInStock:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        required:true,
        trim:true
    },
    productImage:[{
        type:String,
        required:true
    }],
    productRating:{
        type:Number,
        default:0,
        max:5
    },
    category:{
        type:ObjectId,
        required:true,
        ref:`Category`
    }
},{timestamps:true})

const productModel = mongoose.model(`Product`,productSchema)

module.exports={productModel}