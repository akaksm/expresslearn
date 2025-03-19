const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../utils/asyncHandler')
const { ApiError } = require('../utils/apiError')
const { userModel } = require('../models/userModel')

const authMiddleware = asyncHandler(async(req,res, next)=>{
    const datatoken = req.header('Authorization')?.replace('Bearer ','')
    if(!datatoken) throw new ApiError(`Token is not availabe`,400)
    const data = jwt.verify(datatoken, process.env.JWT_SECRET)
    // console.log(data)
    const user = await userModel.findById(data.id)
    req.user = user
    next()
})

module.exports = {authMiddleware}
