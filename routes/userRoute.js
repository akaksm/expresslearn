const express = require('express')
const { register, verifyOTP, resendOtp, loginUser, passwordChange, forgetPassword, verifyForgetPasswordOTP, forgetPasswordChange } = require('../controller/userController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register',register)
router.post('/verifyotp',verifyOTP)
router.put('/resendotp',resendOtp)
router.post('/loginuser',loginUser)
router.put('/reset/password',authMiddleware,passwordChange)
router.put('/reset/forgetpassword',forgetPassword)
router.put('/verifyforgetpasswordotp',verifyForgetPasswordOTP)
router.put('/forgetpasswordchange',forgetPasswordChange)

module.exports = router