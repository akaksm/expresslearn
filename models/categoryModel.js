const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

const categoryModel = mongoose.model('Category',categorySchema)

module.exports = {categoryModel}