const { categoryModel } = require("../models/categoryModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");


const postCategory = asyncHandler(async(req,res)=>{
    const {title} = req.body
    let category = await categoryModel.findOne({title: { $regex: new RegExp(`^${title}$`, "i") }})
    if (category) throw new ApiError(`Category already exists.`,400)

    category = await categoryModel.create({
        ...req.body
    })

    return res.status(201).json(new ApiResponse(`Category has been created`,category))
})

const updateCategory = asyncHandler(async(req,res)=>{
    const {title} = req.body
    let category = await categoryModel.findById(req.params.id)
    if (!category) throw new ApiError(`Did not find the category.`,400)
    category.title = title
    await category.save()
    return res.status(201).json(new ApiResponse(`Category updated successfully`,category))

})

const showCategory = asyncHandler(async(req,res)=>{
    const category = await categoryModel.find()
    if (!category) throw new ApiError(`Something went wrong`,400)
    return res.status(201).json(new ApiResponse(`Available categories`,category))
})

const searchCategory = asyncHandler(async(req,res)=>{
    if(req.query.title) {
        const category = await categoryModel.findOne({title:{$regex : new RegExp(`^${title}$`,"i")}})
        if (!category) throw new ApiError(`Something went wrong`,400)
        return res.status(201).json(new ApiResponse(`Available category`,category))
    } else {
        const category = await categoryModel.find()
        if (!category) throw new ApiError(`something went wrong`,400)
        return res.status(201).json(new ApiResponse(`Available category`,category))
    }
})

const categoryDetails = asyncHandler(async(req,res)=>{
    const category = await categoryModel.findById(req.params.id)
    if (!category) throw new ApiError(`Something went wrong`,400)
    return res.status(201).json(new ApiResponse(`Available category`,category))
})

module.exports = {postCategory,updateCategory,showCategory,searchCategory,categoryDetails}