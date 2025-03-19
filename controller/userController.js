const { userModel } = require("../models/userModel")
const bcrypt = require('bcrypt')
const { ApiError } = require("../utils/apiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { ApiResponse } = require('../utils/apiResponse')
const crypto = require('crypto')
const { sendEmailVerificationEmail, sendForgetPasswordVerificationEmail } = require("../email/emailService")
const { generateToken } = require("../utils/generateToken")

    // genereate opt using crypto
    const generateSecureOTP = () => {
        return (crypto.randomInt(1000, 9999)).toString()
    }

const register = asyncHandler(async(req,res) => {

    // take the data from the front end
    const {name,email,phone,password,confirmPassword} = req.body

    // check all fields are required
    if(!name || !email || !phone || !password || !confirmPassword) throw new ApiError(`All fields are required.`,400)
    // {
    //     return res.status(400).json({error:`All fields are required.`})
    // }

    // Check password and confirm-password are equal or not
    if ( password !== confirmPassword) throw new ApiError(`Password does not match.`,400)
    // {
    //     return res.status(400).json({error:`Password does not match.`})
    // }

    // check email is already registered or not
    const existUser = await userModel.findOne({email:email})
    if(existUser) throw new ApiError(`Email already registered.`)
    // {
    //     return res.status(400).json({error:`Email already registered.`})
    // }

    // password hashing using bcrypt, to install: npm i bcrypt 
    const salt = await bcrypt.genSalt(10)
    const hash_password = await bcrypt.hash(password,salt)


    //save generated otp
    const otp = generateSecureOTP()
    // set expiration time in milliseconds
    const otpExpires = Date.now()+10*60*1000

    // save all data into database
    const user = await userModel.create({
        ...req.body,
        password:hash_password,
        otp:otp,
        otpExpires:otpExpires
    })


    // send email configuration
    sendEmailVerificationEmail(user)

    // return the data of the newly registered user when every thing goes right
    return res.status(201).json(new ApiResponse(`User registration successfull.`, user))
})

const verifyOTP = asyncHandler(async(req,res) => {

    // take otp from the frontend
    let {otp}=req.body
    if (!otp) throw new ApiError(`Otp is required.`)

    // check user is available 
    const user=await userModel.findOne({otp})

    // Verify otp is correct or not
    if(!user) throw new ApiError(`Invalid OTP.`,400)

    // verify weather the otp is expired or not.
    if(user.otpExpires < Date.now()) throw new ApiError(`OTP has been expired`, 400)

    
    user.isVerified = true // user email gets verify
    user.otp = null // blank otp
    user.otpExpires = null // blank otp expire time
    await user.save()
    return res.status(201).json(new ApiResponse(`OTP verification successfull.`,user.isVerified))
})

const resendOtp=asyncHandler(async(req, res)=>{
    const {email}=req.body
    const user=await userModel.findOne({email:email})
    if (!user) throw new ApiError('Email is not registered.')
        user.otp = generateSecureOTP()
        user.otpExpires = Date.now()+10*60*1000

    sendEmailVerificationEmail(user)
    await user.save()
    res.status(201).json(new ApiResponse(`New otp has been sent to your email.`,user))

})

const searchUser = asyncHandler(async(req,res)=>{
    if (req.query.name) {
        const user = await userModel.find({
            name : {
                $regex : req.query.name,
                $options:'i'
            }
        })

        if (!user) throw new ApiError(`User not found`,400)

        return res.status(201).json(new ApiResponse(`Available user`,user))
    } else {
        const user = await userModel.find()
        if (!user) throw new ApiError(`Unable to find users`,400)
        return res.status(201).json(new ApiResponse(`Available blogs`,user))
    }
})


const userDetails = asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.params.id)
    if (!user) throw new ApiError(`Unable to find the user`,400)
    return res.status(201).json(new ApiResponse(`Available user details`,user))
})

const updateUser = asyncHandler(async(req,res)=>{
    const id = req.user
    const {name,email,phone,password} = req.body

    const user = await userModel.findById(id)
    if (!user) throw new ApiError(`User not found`,400)

    user.name = name
    user.email = email
    user.phone = phone

    await user.save()

    return res.status(200).json(new ApiResponse(`User updated successfully`,user))
})

const deleteUser = asyncHandler(async(req,res)=>{
    const deleteUser = await userModel.findByIdAndDelete(req.params.id)
    if (!deleteUser) throw new ApiError(`User not found`,400)
    return res.status(201).json(new ApiResponse(`User deleted successfully`,deleteUser))
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError("Email and password are required.", 400)
  const user = await userModel.findOne({ email: email });
  if (!user) throw new ApiError("Email is not registered.", 400)
  const comparepassword = await bcrypt.compare(password, user.password);
  if (!comparepassword) throw new ApiError("Wrong password.", 400)
  if(!user.isVerified) throw new ApiError("Please verify your email.", 400)

  // return user information to frontend
  const data={
    id:user._id,
    email:user.email
  }
  const token = generateToken(data)

  const showdata = await userModel.findById(user._id).select('-password')
  return res.json({token,data:showdata})
})

const passwordChange = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {oldpassword,password,confirmPassword} = req.body
    const user = await userModel.findById(_id)
    if (!user) throw new ApiError(`Something went wrong`,400)
    if (!oldpassword || !password || !confirmPassword) throw new ApiError(`One or more fields are empty`,400)
    if (password !== confirmPassword) throw new ApiError(`confirm password and password does not match`,400)
    const comparepassword = await bcrypt.compare(oldpassword,user.password)
    if (comparepassword) {
        const hash_password = await bcrypt.hash(password,10)
        user.password = hash_password
        await user.save()

        return res.status(200).json(new ApiResponse(`Password changed successfully.`))
    }
    return res.status(400).json(new ApiResponse(`Old password is incorrect.`))
})

const forgetPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const user = await userModel.findOne({email:email})
    if (!user) throw new ApiError(`Something went wrong`,400)

    const otp = generateSecureOTP()
    const otpExpires = Date.now()+10*60*1000

    user.forgetPassword.otp=otp
    user.forgetPassword.otpExpires=otpExpires

    await user.save()

    await sendForgetPasswordVerificationEmail(user)

    return res.status(201).json(new ApiResponse(`Password reset OTP has been sent to your email.`,user.email))
    
})

const verifyForgetPasswordOTP = asyncHandler(async(req,res)=>{
    let {otp} = req.body
    if (!otp) throw new ApiError(`Otp is required.`)

    const user = await userModel.findOne({'forgetPassword.otp':otp})

    if(!user) throw new ApiError(`Invalid OTP.`,400)

    if(user.forgetPassword.otpExpires < Date.now()) throw new ApiError(`OTP has been expired`,400)

    user.forgetPassword.isVerified = true
    user.forgetPassword.otp = null
    user.forgetPassword.otpExpires = null
    await user.save()
    return res.status(201).json(new ApiResponse(`OTP verification successfull.`,user.forgetPassword.isVerified))
})

const forgetPasswordChange = asyncHandler(async(req,res)=>{
    const {email,password,confirmPassword} = req.body
    if ( password !== confirmPassword) throw new ApiError(`Password does not match.`,400)
    const user = await userModel.findOne({email:email})
    if (!user) throw new ApiError(`Email is not registered`)
    if (!user.forgetPassword.isVerified) throw new ApiError(`Please verify your otp first.`,400)

    const salt = await bcrypt.genSalt(10)
    const hash_password = await bcrypt.hash(password,salt)
    user.password=hash_password
    await user.save()

    return res.status(201).json(new ApiResponse(`Password has been changed successfully.`))
})

module.exports = {register,verifyOTP,resendOtp,loginUser,deleteUser,userDetails,searchUser,updateUser,passwordChange,forgetPassword,verifyForgetPasswordOTP,forgetPasswordChange}