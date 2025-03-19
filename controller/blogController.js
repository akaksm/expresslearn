const { blogModel } = require("../models/blogModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");



const postBlog = asyncHandler(async(req,res)=>{
    const id=req.user
 
    const {title,description} = req.body

    if (!req.files || req.files.length === 0) throw new ApiError(`Image files are required`,400)


    if(!title || !description   ) throw new ApiError(`All fields are required.`, 400)

    
    
    const pictures = []
    req.files.map(item=>{
        pictures.push(item.filename)
    })

    const blog = await blogModel.create({
        ...req.body,
        postBy: id._id,
        image: pictures
    })

    return res.status(201).json(new ApiResponse(`Blog created successfully.`, blog))
    
})

const getBlog = asyncHandler(async(req,res)=>{
    if (req.query.title) {
        const blog = await blogModel.find({
            title:{
                $regex:req.query.title,
                $options:'i'
            }
        })

        if (!blog) throw new ApiError(`Unable to find the blog`, 400)
        
        return res.status(201).json(new ApiResponse(`Available blogs`,blog))

    } else {
        const blog = await blogModel.find()
        if (!blog) throw new ApiError(`Unable to find the blog`, 400)
        return res.status(201).json(new ApiResponse(`Available blogs`,blog))
    }

})


const getBlogDetails = asyncHandler(async(req,res)=>{
    const blog = await blogModel.findById(req.params.id)
    if(!blog) throw new ApiError(`Unable to find the blog.`,400)

    return res.status(201).json(new ApiResponse(`Available blog`,blog))
})

const updateBlog = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {id} = req.params
    const {title,description} = req.body

    const blog = await blogModel.findById(id)
    if (!blog) throw new ApiError(`Blog not found`,400)


    if (blog.postBy.toString() !== userId._id.toString()) throw new ApiError(`You are not authorized ot update this blog`,403)

    let updateImages = blog.image
    if (req.files && req.files.length > 0) {
        updateImages = req.files.map(item=>updateImages.push(item.filename))
    }

    blog.title = title || blog.title
    blog.description = description || blog.description
    blog.image = updateImages

    await blog.save()

    return res.status(200).json(new ApiResponse("Blog updated successfully", blog))
})

const deleteBlog = asyncHandler(async(req,res)=>{
    const deleteBlog = await blogModel.findByIdAndDelete(req.params.id)
    if (!deleteBlog) throw new ApiError(`Blog not found`,400)
    return res.status(200).json(new ApiResponse(`Blog deleted successfully`,201))
})


module.exports = {postBlog,getBlog,getBlogDetails,updateBlog,deleteBlog}