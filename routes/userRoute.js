const express = require('express')
const { register, verifyOTP, resendOtp, loginUser, passwordChange } = require('../controller/userController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register',register)
router.post('/verifyotp',verifyOTP)
router.put('/resendotp',resendOtp)
router.post('/loginuser',loginUser)
router.put('/reset/password',authMiddleware,passwordChange)

module.exports = router