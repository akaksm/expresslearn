const { categoryModel } = require("../models/categoryModel");
const { productModel } = require("../models/productModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");


const postProduct = asyncHandler(async(req,res)=>{
    const {productName,productPrice,countInStock,productDescription,category} = req.body

    if (!productName || !productPrice || !countInStock || !productDescription ||!category) throw new ApiError(`All fields are required`)
    
    if (!req.files) throw new ApiError(`Image file is required`,400)

    const Category = await categoryModel.findById(category)
    if (!Category) throw new ApiError(`Enter a valid category`,400)

    let picture = []
    req.files.map(item=>{picture.push(item.filename)})

    const product = await productModel.create({
        ...req.body,
        productImage:picture
    })

    return res.status(201).json(new ApiResponse(`Product registration successfull.`,product))
})

const getProduct = asyncHandler(async(req,res)=>{
    const product = await productModel.find()
    if (!product) throw new ApiError(`Something went wrong`,400)
    return res.status(201).json(new ApiResponse(`Available resourses`,product))
})

const getProductDetails = asyncHandler(async(req,res)=>{
    const product = await productModel.findById(req.params.id)
    if (!product) throw new ApiError(`Something went wrong`,400)
    return res.status(201).json(new ApiResponse(`Available resources`,product))
})

const updateProduct = asyncHandler(async(req,res)=>{
    const { category } = req.body

    if (category) {
        const Category = await categoryModel.findById(category)
        if (!Category) throw new ApiError(`Enter a valid category`, 400)
    }

    const product = await productModel.findById(req.params.id)
    if (!product) throw new ApiError(`Product not found`, 404)

    // Check if files are uploaded
    if (req.files && req.files.length > 0) {
        let picture = []
        req.files.map(item => { picture.push(item.filename) })
        req.body.productImage = picture // Update the image files
    }

    Object.assign(product, req.body)
    await product.save()

    return res.status(200).json(new ApiResponse(`Product updated successfully`, product))
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const product = await productModel.findByIdAndDelete(req.params.id)
    if (!product) throw new ApiError(`Product not found`, 404)

    return res.status(200).json(new ApiResponse(`Product deleted successfully`, product))
})

module.exports = {postProduct,getProduct,getProductDetails,updateProduct,deleteProduct}