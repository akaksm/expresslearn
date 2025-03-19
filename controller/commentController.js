const { blogModel } = require("../models/blogModel");
const { commentModel } = require("../models/commentModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");


const postComment = asyncHandler(async(req,res)=>{
    const userId = req.user
    const  {title, blog}=req.body
    const comment = await commentModel.create({
        title,
        blog,
        user:userId._id
    })
    return res.status(201).json({message:"Comment added", data:comment})
})

const updateComment = asyncHandler(async(req,res)=>{
    const userId = req.user
    // console.log(userId._id)
    const {title,blog} = req.body 


    const comment = await commentModel.findById(req.params.id)
    // console.log(comment.user.toString())
    if (!comment) throw new ApiError(`Comment not found`,400)

    if (comment.user.toString() !== userId._id.toString()) throw new ApiError(`Unauthorize to edit comment`,400)
    // console.log(comment.user,userId._id)

    comment.title = title
    comment.blog = blog

    await comment.save()

    return res.status(201).json(new ApiResponse(`Comment updated`,comment))
    
})

const getComment = asyncHandler(async(req,res)=>{
    if (req.query.title) {
        const comment = await commentModel.find({
            title:{
                $regex:req.query.title,
                $options:'i'
            }
        })

        if (!comment) throw new ApiError(`Comment not found`,400)

        return res.status(201).json(new ApiResponse(`Available comment`,comment))
        
    } else { 
        const comment = await commentModel.find()

        if (!comment) throw new ApiError(`Comment not found`,400)

        return res.status(201).json(new ApiResponse(`Available comment`,comment))
        
    }
})

const getCommentDetails = asyncHandler(async(req,res)=>{
    const comment = await commentModel.findById(req.params.id)

    if (!comment) throw new ApiError(`Comment not found`,400)

    return res.status(201).json(new ApiResponse(`Available comment`,comment))
})

const deleteComment = asyncHandler(async(req,res)=>{
    const comment = await commentModel.findByIdAndDelete(req.params.id)

    if (!comment) throw new ApiError(`Couldn't find the comment`,400)

    return res.status(200).json(new ApiResponse(`Available Comment`,comment))
})

module.exports={postComment,updateComment, getComment, getCommentDetails,deleteComment}